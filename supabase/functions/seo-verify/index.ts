import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const BASE_URL = 'https://vladenza.com';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the caller is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check CRM owner membership
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: ownerCheck } = await serviceClient
      .from('crm_owners')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!ownerCheck) {
      return new Response(JSON.stringify({ error: 'Not a CRM owner' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get the pending revision
    const { data: pendingRev, error: revError } = await serviceClient
      .from('seo_revisions')
      .select('*')
      .eq('status', 'pending')
      .order('number', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (revError || !pendingRev) {
      return new Response(JSON.stringify({ error: 'No pending revision to verify' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch the deployed build manifest
    const manifestRes = await fetch(`${BASE_URL}/seo-build-manifest.json`);
    if (!manifestRes.ok) {
      // Fail the revision — deployment not reachable
      await serviceClient.rpc('fail_seo_revision', {
        p_revision_id: pendingRev.id,
        p_reason: `Build manifest not accessible (${manifestRes.status})`,
      });
      return new Response(JSON.stringify({
        ok: false,
        error: 'Build manifest not accessible',
        status: manifestRes.status,
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const deployedManifest = await manifestRes.json();

    // Verify the deployed revision ID matches the pending revision
    if (deployedManifest.revisionId !== pendingRev.id) {
      await serviceClient.rpc('fail_seo_revision', {
        p_revision_id: pendingRev.id,
        p_reason: `Deployed revision ID mismatch: expected ${pendingRev.id}, got ${deployedManifest.revisionId}`,
      });
      return new Response(JSON.stringify({
        ok: false,
        error: 'Revision ID mismatch',
        expected: pendingRev.id,
        deployed: deployedManifest.revisionId,
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Verify key pages by fetching live HTML and comparing metadata
    const metadata = pendingRev.metadata || {};
    const results: Array<{ page: string; url: string; ok: boolean; errors: string[] }> = [];
    let allOk = true;

    for (const [pageKey, entry] of Object.entries(metadata)) {
      const errors: string[] = [];
      const route = pageKey === 'home' ? '/' : `/${pageKey}`;
      const url = `${BASE_URL}${route}${route === '/' ? '' : '/'}`;

      try {
        const htmlRes = await fetch(url, { headers: { 'User-Agent': 'Vladenza-SEO-Verify/1.0' } });
        if (!htmlRes.ok) {
          errors.push(`HTTP ${htmlRes.status}`);
          results.push({ page: pageKey, url, ok: false, errors });
          allOk = false;
          continue;
        }
        const html = await htmlRes.text();

        // Extract and compare title
        const titleMatch = html.match(/<title>(.*?)<\/title>/s);
        const liveTitle = titleMatch ? titleMatch[1].trim() : '';
        if (entry.title && liveTitle !== entry.title) {
          errors.push(`Title mismatch: expected "${entry.title}", got "${liveTitle}"`);
        }

        // Extract and compare meta description
        const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
        const liveDesc = descMatch ? descMatch[1] : '';
        if (entry.description && liveDesc !== entry.description) {
          errors.push(`Description mismatch: expected "${entry.description.slice(0, 60)}...", got "${liveDesc.slice(0, 60)}..."`);
        }

        // Extract and compare canonical
        const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/);
        const liveCanonical = canonicalMatch ? canonicalMatch[1] : '';
        if (entry.canonical && liveCanonical && liveCanonical !== entry.canonical) {
          errors.push(`Canonical mismatch: expected "${entry.canonical}", got "${liveCanonical}"`);
        }
      } catch (err) {
        errors.push(`Fetch error: ${err.message}`);
      }

      const pageOk = errors.length === 0;
      if (!pageOk) allOk = false;
      results.push({ page: pageKey, url, ok: pageOk, errors });
    }

    if (allOk) {
      // Activate the revision
      const { error: activateError } = await serviceClient.rpc('activate_seo_revision', {
        p_revision_id: pendingRev.id,
        p_html_hash: null,
      });
      if (activateError) {
        return new Response(JSON.stringify({
          ok: false,
          error: 'Verification passed but activation failed',
          detail: activateError.message,
          results,
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      return new Response(JSON.stringify({
        ok: true,
        revision_number: pendingRev.number,
        status: 'active',
        results,
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } else {
      // Fail the revision
      const failedPages = results.filter(r => !r.ok).map(r => `${r.page}: ${r.errors.join('; ')}`);
      await serviceClient.rpc('fail_seo_revision', {
        p_revision_id: pendingRev.id,
        p_reason: `Verification failed: ${failedPages.join(' | ')}`,
      });
      return new Response(JSON.stringify({
        ok: false,
        status: 'failed',
        results,
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
