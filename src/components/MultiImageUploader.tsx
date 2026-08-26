import { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, Loader2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getStoragePath(folder: string, file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  return `${folder}/${timestamp}-${random}.${ext}`;
}

function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}

async function deleteStorageObject(url: string): Promise<void> {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
    if (match) await supabase.storage.from('media').remove([match[1]]);
  } catch { /* legacy external URL — nothing to delete */ }
}

interface MultiImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  label?: string;
}

export default function MultiImageUploader({
  value,
  onChange,
  folder,
  label = 'Images',
}: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, or WebP files are accepted.');
      return null;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(`"${file.name}" is too large. Maximum size is 5MB.`);
      return null;
    }

    const path = getStoragePath(folder, file);
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw uploadError;
    return getPublicUrl(path);
  }, [folder]);

  const handleFiles = useCallback(async (files: FileList) => {
    setError(null);
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    if (urls.length > 0) onChange([...value, ...urls]);
    setUploading(false);
  }, [uploadFile, onChange, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const handleRemove = async (index: number) => {
    const url = value[index];
    if (url) await deleteStorageObject(url);
    onChange(value.filter((_, i) => i !== index));
  };

  const handleReplace = async (index: number) => {
    // Use a temporary input to get a single file
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = 'image/jpeg,image/png,image/webp';
    tempInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setError(null);
      setUploading(true);
      const url = await uploadFile(file);
      if (url) {
        const oldUrl = value[index];
        if (oldUrl) await deleteStorageObject(oldUrl);
        const next = [...value];
        next[index] = url;
        onChange(next);
      }
      setUploading(false);
    };
    tempInput.click();
  };

  return (
    <div>
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
          {label}
        </label>
      )}

      {error && (
        <div className="mb-2 flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto flex-shrink-0 hover:text-red-800">
            <X size={12} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {/* Existing images */}
        {value.map((src, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 h-28">
            <img
              src={src}
              alt={`Screenshot ${i + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => handleReplace(i)}
                disabled={uploading}
                className="bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition disabled:opacity-50"
              >
                <Upload size={11} /> Replace
              </button>
              <button
                onClick={() => handleRemove(i)}
                disabled={uploading}
                className="bg-red-500/90 hover:bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 transition disabled:opacity-50"
              >
                <X size={11} /> Delete
              </button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Loader2 size={16} className="text-gray-500 animate-spin" />
              </div>
            )}
          </div>
        ))}

        {/* Upload tile */}
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors h-28 ${
            dragOver ? 'border-[#F97316] bg-orange-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          } ${uploading ? 'pointer-events-none' : ''}`}
        >
          {uploading ? (
            <Loader2 size={18} className="text-[#F97316] animate-spin" />
          ) : (
            <>
              <Plus size={18} className="text-gray-300" />
              <span className="text-[10px] text-gray-400 text-center px-2">Add images</span>
            </>
          )}
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mt-1.5">JPG, PNG, WebP — max 5MB each. Click or drag & drop.</p>

      {/* Legacy URL input */}
      <details className="mt-1.5">
        <summary className="text-[10px] text-gray-400 hover:text-gray-500 cursor-pointer select-none">
          Or paste an external URL manually
        </summary>
        <div className="flex gap-1 mt-1.5">
          <input
            type="url"
            placeholder="https://example.com/screenshot.jpg"
            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900/10 placeholder-gray-300"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const input = e.currentTarget;
                if (input.value.trim()) {
                  onChange([...value, input.value.trim()]);
                  input.value = '';
                }
              }
            }}
          />
          <button
            onClick={(e) => {
              const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
              if (input?.value.trim()) {
                onChange([...value, input.value.trim()]);
                input.value = '';
              }
            }}
            className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs hover:bg-gray-800 transition"
          >
            <Plus size={12} />
          </button>
        </div>
      </details>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
