import { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

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

async function deleteStorageObject(path: string): Promise<void> {
  // Extract the path after the bucket URL prefix
  const url = new URL(path);
  const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
  if (pathMatch) {
    await supabase.storage.from('media').remove([pathMatch[1]]);
  }
}

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  className?: string;
  previewClassName?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder,
  label = 'Image',
  className = '',
  previewClassName = 'h-28',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousPathRef = useRef<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPG, PNG, or WebP files are accepted.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is 5MB (file is ${(file.size / 1024 / 1024).toFixed(1)}MB).`);
      return;
    }

    setUploading(true);
    setProgress(0);

    const path = getStoragePath(folder, file);

    try {
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const publicUrl = getPublicUrl(path);

      // Track the previous uploaded path so we can clean it up on replace/delete
      if (value && value.includes('/storage/v1/object/public/media/')) {
        previousPathRef.current = value;
      }

      onChange(publicUrl);
      setProgress(100);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(msg);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [folder, onChange, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleReplace = () => {
    inputRef.current?.click();
  };

  const handleDelete = async () => {
    if (value) {
      // Try to delete from storage if it's a stored object
      if (value.includes('/storage/v1/object/public/media/')) {
        await deleteStorageObject(value);
      }
    }
    onChange('');
    setError(null);
  };

  const hasImage = !!value;

  return (
    <div className={className}>
      {label && (
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
          <ImageIcon size={11} /> {label}
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

      {hasImage ? (
        <div className={`relative group rounded-xl overflow-hidden border border-gray-200 ${previewClassName}`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3'; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleReplace}
              disabled={uploading}
              className="bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Upload size={12} /> Replace
            </button>
            <button
              onClick={handleDelete}
              disabled={uploading}
              className="bg-red-500/90 hover:bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <X size={12} /> Delete
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 size={20} className="text-gray-500 animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${previewClassName} ${
            dragOver ? 'border-[#F97316] bg-orange-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          } ${uploading ? 'pointer-events-none' : ''}`}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="text-[#F97316] animate-spin" />
              <span className="text-xs text-gray-500">{progress > 0 ? `Uploading... ${progress}%` : 'Uploading...'}</span>
            </>
          ) : (
            <>
              <Upload size={18} className="text-gray-300" />
              <span className="text-xs text-gray-400">Click to upload or drag & drop</span>
              <span className="text-[10px] text-gray-300">JPG, PNG, WebP — max 5MB</span>
            </>
          )}
        </div>
      )}

      {uploading && progress > 0 && (
        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#F97316] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* URL field for manual/legacy URLs */}
      <details className="mt-2">
        <summary className="text-[10px] text-gray-400 hover:text-gray-500 cursor-pointer select-none">
          Or paste an external URL manually
        </summary>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1.5 w-full text-xs border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900/10 placeholder-gray-300"
        />
      </details>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
