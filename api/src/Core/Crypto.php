<?php

declare(strict_types=1);

namespace Falschcard\Core;

/**
 * AES-256-GCM encrypt / decrypt for sensitive fields (Gemini API keys).
 *
 * Storage format: base64( IV[12] + TAG[16] + CIPHERTEXT )
 * The APP_CRYPTO_KEY must be a base64-encoded 32-byte value.
 */
final class Crypto
{
    private const CIPHER  = 'aes-256-gcm';
    private const IV_LEN  = 12;   // 96-bit nonce (GCM standard)
    private const TAG_LEN = 16;   // 128-bit authentication tag

    private static function rawKey(): string
    {
        $b64 = Env::cryptoKey();
        if ($b64 === '') {
            throw new \RuntimeException('APP_CRYPTO_KEY is not configured.');
        }
        $key = base64_decode($b64, true);
        if ($key === false || strlen($key) !== 32) {
            throw new \RuntimeException(
                'APP_CRYPTO_KEY must be a base64-encoded 32-byte value. ' .
                'Generate with: openssl rand -base64 32'
            );
        }
        return $key;
    }

    /** Encrypt a plaintext string and return a base64-encoded blob. */
    public static function encrypt(string $plaintext): string
    {
        $key = self::rawKey();
        $iv  = random_bytes(self::IV_LEN);
        $tag = '';

        $ciphertext = openssl_encrypt(
            $plaintext,
            self::CIPHER,
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag,
            '',
            self::TAG_LEN
        );

        if ($ciphertext === false) {
            throw new \RuntimeException('Encryption failed.');
        }

        return base64_encode($iv . $tag . $ciphertext);
    }

    /** Decrypt a base64-encoded blob returned by encrypt(). */
    public static function decrypt(string $blob): string
    {
        $key  = self::rawKey();
        $data = base64_decode($blob, true);

        if ($data === false || strlen($data) < self::IV_LEN + self::TAG_LEN + 1) {
            throw new \RuntimeException('Invalid encrypted data.');
        }

        $iv         = substr($data, 0, self::IV_LEN);
        $tag        = substr($data, self::IV_LEN, self::TAG_LEN);
        $ciphertext = substr($data, self::IV_LEN + self::TAG_LEN);

        $plaintext = openssl_decrypt(
            $ciphertext,
            self::CIPHER,
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if ($plaintext === false) {
            throw new \RuntimeException('Decryption failed (wrong key or corrupted data).');
        }

        return $plaintext;
    }

    /** Encrypt to binary (for VARBINARY storage). */
    public static function encryptBinary(string $plaintext): string
    {
        $b64 = self::encrypt($plaintext);
        // Store as raw binary to be space-efficient in VARBINARY
        return base64_decode($b64, true);
    }

    /** Decrypt from binary. */
    public static function decryptBinary(string $binary): string
    {
        return self::decrypt(base64_encode($binary));
    }
}
