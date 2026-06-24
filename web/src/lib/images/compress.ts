/**
 * Client-side image compression.
 *
 * Resizes large photos, normalises EXIF orientation, and re-encodes to WebP
 * (with a JPEG fallback for browsers that cannot encode WebP). Doing this in
 * the browser keeps the Raspberry Pi server free of heavy image work and cuts
 * upload bandwidth dramatically.
 *
 * No external dependency: uses createImageBitmap (with EXIF orientation) +
 * <canvas>.toBlob, both available in all current browsers.
 */

/** Longest edge after resize. Keeps images crisp on retina without huge files. */
const MAX_EDGE = 1600;
/** WebP/JPEG quality (0–1). 0.8 is a good size/quality trade-off. */
const QUALITY = 0.8;
/** Reject originals larger than this BEFORE compression (sanity guard). */
const MAX_INPUT_BYTES = 15 * 1024 * 1024;

export interface CompressedImage {
	blob: Blob;
	/** 'webp' or 'jpg' — the actual encoded format. */
	ext: 'webp' | 'jpg';
}

export class ImageCompressError extends Error {}

/** True for formats the browser canvas cannot decode (notably iPhone HEIC/HEIF). */
function isUndecodable(file: File): boolean {
	const t = file.type.toLowerCase();
	const n = file.name.toLowerCase();
	return t.includes('heic') || t.includes('heif') || n.endsWith('.heic') || n.endsWith('.heif');
}

/**
 * Compress + convert an image File. Throws ImageCompressError with a
 * user-friendly Italian message on unsupported/oversized/corrupt input.
 */
export async function compressImage(file: File): Promise<CompressedImage> {
	if (!file.type.startsWith('image/') && !isUndecodable(file)) {
		throw new ImageCompressError('Il file selezionato non è un\'immagine.');
	}
	if (isUndecodable(file)) {
		throw new ImageCompressError(
			'Formato HEIC/HEIF non supportato. Converti la foto in JPEG o PNG prima di caricarla.'
		);
	}
	if (file.size > MAX_INPUT_BYTES) {
		throw new ImageCompressError('Immagine troppo grande (max 15 MB).');
	}

	// Decode honouring EXIF orientation so portrait photos are not rotated.
	let bitmap: ImageBitmap;
	try {
		bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
	} catch {
		// Fallback for browsers without the imageOrientation option.
		try {
			bitmap = await createImageBitmap(file);
		} catch {
			throw new ImageCompressError('Impossibile leggere l\'immagine. Riprova con un altro file.');
		}
	}

	const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
	const w = Math.max(1, Math.round(bitmap.width * scale));
	const h = Math.max(1, Math.round(bitmap.height * scale));

	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new ImageCompressError('Elaborazione immagine non disponibile sul dispositivo.');
	ctx.drawImage(bitmap, 0, 0, w, h);
	bitmap.close?.();

	// Prefer WebP; fall back to JPEG if the browser cannot encode WebP.
	let blob = await toBlob(canvas, 'image/webp', QUALITY);
	let ext: 'webp' | 'jpg' = 'webp';
	if (!blob || blob.type !== 'image/webp') {
		blob = await toBlob(canvas, 'image/jpeg', QUALITY);
		ext = 'jpg';
	}
	if (!blob) throw new ImageCompressError('Conversione immagine non riuscita.');

	return { blob, ext };
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
	return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}
