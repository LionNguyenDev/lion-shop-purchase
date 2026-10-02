'use client';

import { optimizedImage } from '@/lib/image';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';
import { useState } from 'react';

/** Product image (Cloudinary or any URL) with a placeholder when missing or broken. */
interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  /** Rendered width in px, used to request a resized Cloudinary image. */
  width?: number;
}

export function ProductImage({ src, alt, className, width = 600 }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className={cn('flex items-center justify-center bg-primary-soft text-primary/60', className)}>
        <Package className='h-1/3 max-h-16 w-1/3 max-w-16' aria-hidden />
        <span className='sr-only'>{alt}</span>
      </div>
    );
  }
  // Plain <img>: Cloudinary already resizes via URL, and pasted links may come from any host
  return (
    <img
      src={optimizedImage(src, width)}
      alt={alt}
      loading='lazy'
      onError={() => setFailed(true)}
      className={cn('object-cover', className)}
    />
  );
}
