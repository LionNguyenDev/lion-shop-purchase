'use client';

import { uploadImage } from '@/api/upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductImage } from '@/components/ui/product-image';
import { cn } from '@/lib/utils';
import { ImagePlus, Loader2, Star, X } from 'lucide-react';
import { type DragEvent, useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

interface ImageUploaderProps {
  value: string[];
  onChange: (images: string[]) => void;
  max?: number;
  error?: string;
  /** Called with true while files are uploading, so the form can block submit. */
  onBusyChange?: (busy: boolean) => void;
}

interface PendingUpload {
  id: string;
  name: string;
  progress: number;
}

const urlSchema = z.url();

export function ImageUploader({ value, onChange, max = 10, error, onBusyChange }: ImageUploaderProps) {
  const inputId = useId();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [dragging, setDragging] = useState(false);
  const [link, setLink] = useState('');
  // Uploads finish out of order, so always append to the latest list
  const latest = useRef(value);
  latest.current = value;

  const remaining = max - value.length - pending.length;
  const busy = pending.length > 0;
  // Notify only when busy flips; the callback identity may change every render
  useEffect(() => onBusyChange?.(busy), [busy]);

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    if (files.length > remaining) {
      toast.error(`Chỉ thêm được tối đa ${max} ảnh`);
      files = files.slice(0, Math.max(0, remaining));
    }
    await Promise.all(
      files.map(async (file) => {
        const id = `${file.name}-${crypto.randomUUID()}`;
        setPending((items) => [...items, { id, name: file.name, progress: 0 }]);
        try {
          const url = await uploadImage(file, (progress) =>
            setPending((items) => items.map((item) => (item.id === id ? { ...item, progress } : item)))
          );
          onChange([...latest.current, url]);
        } catch (uploadError) {
          toast.error((uploadError as Error).message);
        } finally {
          setPending((items) => items.filter((item) => item.id !== id));
        }
      })
    );
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    uploadFiles([...event.dataTransfer.files]);
  };

  const addLink = () => {
    const url = link.trim();
    if (!urlSchema.safeParse(url).success) return toast.error('Link ảnh không hợp lệ');
    if (value.includes(url)) return toast.error('Ảnh này đã có');
    if (remaining <= 0) return toast.error(`Chỉ thêm được tối đa ${max} ảnh`);
    onChange([...value, url]);
    setLink('');
  };

  const makeCover = (index: number) => onChange([value[index], ...value.filter((_, i) => i !== index)]);
  const remove = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <fieldset className='space-y-3'>
      <legend className='mb-1.5 font-semibold text-sm'>Ảnh sản phẩm</legend>
      <ul className='grid grid-cols-3 gap-3 sm:grid-cols-5'>
        {value.map((src, index) => (
          <li key={src} className='group relative aspect-square overflow-hidden rounded-xl border border-border'>
            <ProductImage src={src} alt={`Ảnh ${index + 1}`} width={200} className='h-full w-full' />
            {index === 0 && (
              <span className='absolute bottom-1 left-1 rounded-md bg-primary px-1.5 py-0.5 font-semibold text-[11px] text-white'>
                Ảnh chính
              </span>
            )}
            <div className='absolute top-1 right-1 flex gap-1'>
              {index > 0 && (
                <button
                  type='button'
                  onClick={() => makeCover(index)}
                  className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-foreground shadow transition-colors hover:bg-white hover:text-accent'
                  aria-label={`Đặt ảnh ${index + 1} làm ảnh chính`}
                >
                  <Star className='h-4 w-4' aria-hidden />
                </button>
              )}
              <button
                type='button'
                onClick={() => remove(index)}
                className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-foreground shadow transition-colors hover:bg-white hover:text-destructive'
                aria-label={`Xoá ảnh ${index + 1}`}
              >
                <X className='h-4 w-4' aria-hidden />
              </button>
            </div>
          </li>
        ))}
        {pending.map((item) => (
          <li
            key={item.id}
            className='flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-border bg-muted text-muted-foreground text-xs'
            aria-label={`Đang tải ${item.name}`}
          >
            <Loader2 className='h-5 w-5 animate-spin text-primary' aria-hidden />
            <span className='tabular-nums'>{item.progress}%</span>
          </li>
        ))}
        {remaining > 0 && (
          <li>
            <label
              htmlFor={inputId}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                'flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed p-2 text-center font-semibold text-muted-foreground text-xs transition-colors',
                dragging
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-border hover:border-primary hover:text-primary'
              )}
            >
              <ImagePlus className='h-6 w-6' aria-hidden />
              Tải ảnh lên
            </label>
            <input
              ref={fileInput}
              id={inputId}
              type='file'
              accept='image/png,image/jpeg,image/webp,image/avif,image/gif'
              multiple
              className='sr-only'
              onChange={(event) => {
                uploadFiles([...(event.target.files ?? [])]);
                event.target.value = '';
              }}
            />
          </li>
        )}
      </ul>
      <p className='text-muted-foreground text-xs'>
        Kéo thả hoặc chọn ảnh (JPG, PNG, WebP, tối đa 5MB/ảnh, {max} ảnh). Ảnh đầu tiên là ảnh đại diện.
      </p>
      <div className='flex gap-2'>
        <Input
          type='url'
          value={link}
          onChange={(event) => setLink(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addLink();
            }
          }}
          placeholder='Hoặc dán link ảnh https://...'
          aria-label='Link ảnh'
        />
        <Button variant='outline' onClick={addLink} disabled={!link.trim()}>
          Thêm
        </Button>
      </div>
      {error && (
        <p role='alert' className='font-medium text-destructive text-xs'>
          {error}
        </p>
      )}
    </fieldset>
  );
}
