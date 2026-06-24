<?php

declare(strict_types=1);

namespace Falschcard\Repositories;

use Falschcard\Core\Database;

final class ProfileRepository
{
    /** Return all profiles ordered by name. */
    public function findAll(): array
    {
        return Database::fetchAll(
            'SELECT id, name, created_at, updated_at FROM profiles ORDER BY name ASC'
        );
    }

    /** Find a profile by id. */
    public function findById(int $id): ?array
    {
        return Database::fetchOne(
            'SELECT id, name, created_at, updated_at FROM profiles WHERE id = ?',
            [$id]
        );
    }

    /** Find by name (for duplicate checks). */
    public function findByName(string $name): ?array
    {
        return Database::fetchOne(
            'SELECT id, name FROM profiles WHERE name = ?',
            [$name]
        );
    }

    /** Create a new profile. Returns the new id. */
    public function create(string $name): int
    {
        Database::run('INSERT INTO profiles (name) VALUES (?)', [$name]);
        return Database::lastInsertId();
    }

    /** Rename a profile. Returns rows affected. */
    public function rename(int $id, string $newName): int
    {
        $stmt = Database::run(
            'UPDATE profiles SET name = ? WHERE id = ?',
            [$newName, $id]
        );
        return $stmt->rowCount();
    }

    /** Delete a profile (cascades to decks, cards, settings). */
    public function delete(int $id): int
    {
        $stmt = Database::run('DELETE FROM profiles WHERE id = ?', [$id]);
        return $stmt->rowCount();
    }
}
