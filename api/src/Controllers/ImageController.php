<?php

declare(strict_types=1);

namespace Falschcard\Controllers;

use Falschcard\Core\{Request, Response};
use Falschcard\Repositories\{CardRepository, ImageRepository};

/**
 * Image upload / delete for flashcard sections.
 *
 * Files are stored on disk under public/uploads/<shard>/; only metadata lives
 * in the card_images table. The frontend converts images to WebP client-side,
 * so uploads are normally small WebP blobs (JPEG/PNG/GIF also accepted as a
 * safety net, e.g. when a browser cannot encode WebP).
 *
 * Also exposes static storage helpers (storeBinary / deleteFiles / toUrl) reused
 * by CardController, DeckController and ImportExportController for file cleanup
 * and base64 import.
 */
final class ImageController extends BaseController
{
    /** Max accepted upload size in bytes (post client-side compression). */
    private const MAX_BYTES = 10 * 1024 * 1024;

    /** Allowed real MIME types → file extension. */
    private const MIME_EXT = [
        'image/webp' => 'webp',
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/gif'  => 'gif',
    ];

    public function __construct(
        private readonly CardRepository  $cards  = new CardRepository(),
        private readonly ImageRepository $images = new ImageRepository(),
    ) {}

    /** POST /api/cards/{id}/images — multipart upload of a single image. */
    public function create(Request $req): void
    {
        $cardId = $this->requireIntParam($req);

        $card = $this->cards->findById($cardId);
        if ($card === null) {
            Response::notFound("Carta {$cardId} non trovata.");
        }

        $section = (string) $req->input('section', '');
        if (!in_array($section, ImageRepository::SECTIONS, true)) {
            Response::badRequest('Sezione non valida.');
        }

        $file = $_FILES['file'] ?? null;
        if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            Response::badRequest($this->uploadErrorMessage($file['error'] ?? UPLOAD_ERR_NO_FILE));
        }

        $tmp   = (string) $file['tmp_name'];
        $bytes = (int) ($file['size'] ?? 0);
        if ($bytes <= 0 || !is_uploaded_file($tmp)) {
            Response::badRequest('File non valido.');
        }
        if ($bytes > self::MAX_BYTES) {
            Response::badRequest('Immagine troppo grande (max 10 MB).');
        }

        if ($this->images->countInSection($cardId, $section) >= ImageRepository::MAX_PER_SECTION) {
            Response::badRequest('Massimo ' . ImageRepository::MAX_PER_SECTION . ' immagini per sezione.');
        }

        // Validate the REAL content type (magic bytes), never the client filename.
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime  = (string) $finfo->file($tmp);
        $ext   = self::MIME_EXT[$mime] ?? null;
        if ($ext === null) {
            Response::badRequest('Formato non supportato. Usa WebP, JPEG, PNG o GIF.');
        }

        $binary = file_get_contents($tmp);
        if ($binary === false) {
            Response::serverError('Lettura del file non riuscita.');
        }

        $path = self::storeBinary($binary, $ext);
        if ($path === null) {
            Response::serverError('Salvataggio del file non riuscito.');
        }

        [$w, $h] = self::dimensions($binary);

        $alt = $req->input('alt');
        $id  = $this->images->create($cardId, [
            'section' => $section,
            'path'    => $path,
            'width'   => $w,
            'height'  => $h,
            'bytes'   => $bytes,
            'alt'     => $alt !== null ? mb_substr(trim((string) $alt), 0, 255) : null,
        ]);

        $image        = $this->images->findById($id);
        $image['url'] = self::toUrl($path);
        Response::json(['image' => $image], 201);
    }

    /** DELETE /api/images/{id} — remove row and file from disk. */
    public function delete(Request $req): void
    {
        $id  = $this->requireIntParam($req);
        $row = $this->images->delete($id);
        if ($row === null) {
            Response::notFound("Immagine {$id} non trovata.");
        }
        self::deleteFiles([(string) $row['path']]);
        Response::noContent();
    }

    // ── Static storage helpers (reused by other controllers) ───────────────────

    /** Absolute path of the public/ web root. */
    public static function publicDir(): string
    {
        return ROOT_DIR . '/public';
    }

    /** Map a stored relative path to its public URL. */
    public static function toUrl(string $relativePath): string
    {
        return '/' . ltrim($relativePath, '/');
    }

    /**
     * Persist binary image data to public/uploads/<shard>/ with a random name.
     * Returns the relative path (e.g. "uploads/ab/cd….webp") or null on failure.
     */
    public static function storeBinary(string $binary, string $ext): ?string
    {
        $name  = bin2hex(random_bytes(16)) . '.' . $ext;
        $shard = substr($name, 0, 2);
        $dir   = self::publicDir() . '/uploads/' . $shard;

        if (!is_dir($dir) && !@mkdir($dir, 0775, true) && !is_dir($dir)) {
            return null;
        }
        $rel = 'uploads/' . $shard . '/' . $name;
        if (@file_put_contents(self::publicDir() . '/' . $rel, $binary) === false) {
            return null;
        }
        return $rel;
    }

    /**
     * Delete stored image files by their relative paths. Best-effort; guards
     * against path traversal so only files inside public/uploads/ are removed.
     *
     * @param string[] $relativePaths
     */
    public static function deleteFiles(array $relativePaths): void
    {
        $base = self::publicDir() . '/uploads/';
        foreach ($relativePaths as $rel) {
            $rel = ltrim((string) $rel, '/');
            if ($rel === '' || str_contains($rel, '..')) {
                continue;
            }
            $full = self::publicDir() . '/' . $rel;
            // Only unlink files that resolve inside the uploads directory.
            if (str_starts_with($full, $base) && is_file($full)) {
                @unlink($full);
            }
        }
    }

    /** Decode WebP/JPEG/PNG/GIF binary into [width, height] (nulls if unknown). */
    public static function dimensions(string $binary): array
    {
        $info = @getimagesizefromstring($binary);
        if ($info === false) {
            return [null, null];
        }
        return [(int) $info[0], (int) $info[1]];
    }

    // ── private ────────────────────────────────────────────────────────────────

    private function uploadErrorMessage(int $code): string
    {
        return match ($code) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Immagine troppo grande.',
            UPLOAD_ERR_NO_FILE                        => 'Nessun file ricevuto.',
            UPLOAD_ERR_PARTIAL                        => 'Caricamento interrotto. Riprova.',
            default                                   => 'Caricamento non riuscito.',
        };
    }
}
