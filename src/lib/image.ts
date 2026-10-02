const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

/** Serves Cloudinary images resized and in the best format for the browser; other URLs pass through. */
export function optimizedImage(src: string, width: number) {
  const match = src.match(CLOUDINARY_UPLOAD);
  if (!match) return src;
  return `${match[1]}f_auto,q_auto,c_limit,w_${width}/${match[2]}`;
}
