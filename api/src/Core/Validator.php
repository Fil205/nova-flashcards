<?php

declare(strict_types=1);

namespace Falschcard\Core;

/**
 * Lightweight input validator.
 * Collects errors and either returns them or auto-responds with 422.
 */
final class Validator
{
    private array $errors = [];

    public function required(string $field, mixed $value, string $label = ''): self
    {
        if ($value === null || $value === '') {
            $this->errors[$field] = ($label ?: $field) . ' is required';
        }
        return $this;
    }

    /**
     * @param int $min  Minimum length (0 = no lower bound).
     * @param int $max  Maximum length (0 = no upper bound, i.e. unlimited).
     */
    public function string(string $field, mixed $value, int $min = 0, int $max = 255, string $label = ''): self
    {
        if ($value === null) {
            return $this;
        }
        if (!is_string($value)) {
            $this->errors[$field] = ($label ?: $field) . ' must be a string';
            return $this;
        }
        $len = mb_strlen($value);
        if ($min > 0 && $len < $min) {
            $this->errors[$field] = ($label ?: $field) . " must be at least {$min} characters";
        } elseif ($max > 0 && $len > $max) {
            $this->errors[$field] = ($label ?: $field) . " must be at most {$max} characters";
        }
        return $this;
    }

    public function inList(string $field, mixed $value, array $allowed, string $label = ''): self
    {
        if ($value !== null && !in_array($value, $allowed, true)) {
            $this->errors[$field] = ($label ?: $field) . ' must be one of: ' . implode(', ', $allowed);
        }
        return $this;
    }

    public function numeric(string $field, mixed $value, float $min = -PHP_FLOAT_MAX, float $max = PHP_FLOAT_MAX, string $label = ''): self
    {
        if ($value === null) {
            return $this;
        }
        if (!is_numeric($value)) {
            $this->errors[$field] = ($label ?: $field) . ' must be a number';
            return $this;
        }
        $v = (float) $value;
        if ($v < $min || $v > $max) {
            $this->errors[$field] = ($label ?: $field) . " must be between {$min} and {$max}";
        }
        return $this;
    }

    public function integer(string $field, mixed $value, int $min = PHP_INT_MIN, int $max = PHP_INT_MAX, string $label = ''): self
    {
        if ($value === null) {
            return $this;
        }
        if (!is_int($value) && !(is_string($value) && ctype_digit($value))) {
            $this->errors[$field] = ($label ?: $field) . ' must be an integer';
            return $this;
        }
        $v = (int) $value;
        if ($v < $min || $v > $max) {
            $this->errors[$field] = ($label ?: $field) . " must be between {$min} and {$max}";
        }
        return $this;
    }

    public function isArray(string $field, mixed $value, string $label = ''): self
    {
        if ($value !== null && !is_array($value)) {
            $this->errors[$field] = ($label ?: $field) . ' must be an array';
        }
        return $this;
    }

    public function hasErrors(): bool
    {
        return !empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    /** Abort with 422 if there are validation errors. */
    public function failFast(): void
    {
        if ($this->hasErrors()) {
            Response::validationError($this->errors);
        }
    }
}
