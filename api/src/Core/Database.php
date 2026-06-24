<?php

declare(strict_types=1);

namespace Falschcard\Core;

use PDO;
use PDOException;
use PDOStatement;

/**
 * PDO wrapper — singleton per request.
 * All queries use prepared statements; no raw interpolation of user data.
 */
final class Database
{
    private static ?PDO $pdo = null;

    public static function connect(): PDO
    {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
            Env::dbHost(),
            Env::dbPort(),
            Env::dbName()
        );

        try {
            self::$pdo = new PDO($dsn, Env::dbUser(), Env::dbPass(), [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_FOUND_ROWS   => true,
            ]);
        } catch (PDOException $e) {
            // Never leak credentials or internal paths in responses
            throw new \RuntimeException('Database connection failed: ' . $e->getMessage());
        }

        return self::$pdo;
    }

    /** Execute a prepared statement and return the PDOStatement. */
    public static function run(string $sql, array $params = []): PDOStatement
    {
        $stmt = self::connect()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    /** Fetch all rows. */
    public static function fetchAll(string $sql, array $params = []): array
    {
        return self::run($sql, $params)->fetchAll();
    }

    /** Fetch a single row or null. */
    public static function fetchOne(string $sql, array $params = []): ?array
    {
        $row = self::run($sql, $params)->fetch();
        return $row === false ? null : $row;
    }

    /** Return last insert ID as int. */
    public static function lastInsertId(): int
    {
        return (int) self::connect()->lastInsertId();
    }

    public static function beginTransaction(): void
    {
        self::connect()->beginTransaction();
    }

    public static function commit(): void
    {
        self::connect()->commit();
    }

    public static function rollback(): void
    {
        if (self::connect()->inTransaction()) {
            self::connect()->rollBack();
        }
    }

    /** Execute multiple statements in a single transaction, rollback on failure. */
    public static function transaction(callable $fn): mixed
    {
        self::beginTransaction();
        try {
            $result = $fn();
            self::commit();
            return $result;
        } catch (\Throwable $e) {
            self::rollback();
            throw $e;
        }
    }
}
