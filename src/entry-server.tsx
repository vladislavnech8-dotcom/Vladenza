import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { lastRenderedSEO, type SEOProps } from './hooks/useSEO';
import { blogPosts } from './data/blogPosts';
import { supabase } from './lib/supabase';

export function render(
  url: string,
  preload?: { caseData?: Record<string, unknown>; postData?: Record<string, unknown> }
): Promise<{ html: string; seo: SEOProps | null }> {
  const g = globalThis as Record<string, unknown>;
  if (preload?.caseData) g.__SSR_PRELOADED_CASE__ = preload.caseData;
  else delete g.__SSR_PRELOADED_CASE__;
  if (preload?.postData) g.__SSR_PRELOADED_POST__ = preload.postData;
  else delete g.__SSR_PRELOADED_POST__;
  return new Promise((resolve, reject) => {
    const { pipe } = renderToPipeableStream(
      React.createElement(StaticRouter, { location: url }, React.createElement(App)),
      {
        onAllReady() {
          const chunks: Buffer[] = [];
          const passthrough = new PassThrough();
          passthrough.on('data', (chunk) => chunks.push(chunk));
          passthrough.on('end', () => {
            resolve({ html: Buffer.concat(chunks).toString('utf-8'), seo: lastRenderedSEO });
          });
          passthrough.on('error', reject);
          pipe(passthrough);
        },
        onError(err) {
          reject(err);
        },
      }
    );
  });
}

export function getStaticBlogSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}

export { supabase };
