-- Falschcard — example seed data (optional)
-- Run AFTER schema.sql: mysql -u root -p falschcard < database/seed_examples.sql
-- Creates profile "Demo" with two example decks.

USE falschcard;

-- Insert demo profile (ignore if name already exists)
INSERT IGNORE INTO profiles (name) VALUES ('Demo');

-- Capture id
SET @pid = (SELECT id FROM profiles WHERE name = 'Demo' LIMIT 1);

-- Ensure settings row exists
INSERT IGNORE INTO profile_settings (profile_id) VALUES (@pid);

-- Deck 1: Capitals of Europe
INSERT INTO decks (profile_id, name, description, lang, source, position)
VALUES (@pid, 'Capitali d''Europa', 'Paesi e capitali europee', 'it-IT', 'example', 0);

SET @d1 = LAST_INSERT_ID();

INSERT INTO flashcards (deck_id, question, answer, position) VALUES
(@d1, 'Qual è la capitale della Francia?',         'Parigi',     0),
(@d1, 'Qual è la capitale della Germania?',        'Berlino',    1),
(@d1, 'Qual è la capitale della Spagna?',          'Madrid',     2),
(@d1, 'Qual è la capitale del Portogallo?',        'Lisbona',    3),
(@d1, 'Qual è la capitale dei Paesi Bassi?',       'Amsterdam',  4),
(@d1, 'Qual è la capitale del Belgio?',            'Bruxelles',  5),
(@d1, 'Qual è la capitale della Svezia?',          'Stoccolma',  6),
(@d1, 'Qual è la capitale della Norvegia?',        'Oslo',       7),
(@d1, 'Qual è la capitale della Polonia?',         'Varsavia',   8),
(@d1, 'Qual è la capitale della Repubblica Ceca?', 'Praga',      9);

-- Deck 2: Basic Python
INSERT INTO decks (profile_id, name, description, lang, source, position)
VALUES (@pid, 'Python — Basi', 'Concetti fondamentali di Python', 'it-IT', 'example', 1);

SET @d2 = LAST_INSERT_ID();

INSERT INTO flashcards (deck_id, question, answer, explanation, position) VALUES
(@d2, 'Come si stampa "ciao" in Python?',
  'print("ciao")',
  'La funzione built-in print() scrive sulla stdout. Le virgolette singole o doppie sono equivalenti.',
  0),
(@d2, 'Come si dichiara una lista in Python?',
  'my_list = [1, 2, 3]',
  'Le liste Python sono mutabili, ordinate e possono contenere tipi eterogenei.',
  1),
(@d2, 'Come si crea un dizionario in Python?',
  'my_dict = {"chiave": "valore"}',
  'I dizionari sono strutture chiave-valore. Da Python 3.7+ l''ordine di inserimento è garantito.',
  2),
(@d2, 'Come si scrive un ciclo for su una lista?',
  'for item in my_list:\n    print(item)',
  'Il for in Python itera direttamente sugli elementi, non sugli indici (usa enumerate() per entrambi).',
  3),
(@d2, 'Come si definisce una funzione in Python?',
  'def my_function(param):\n    return param * 2',
  'Il blocco della funzione è delimitato dall''indentazione. def è la keyword, return restituisce il valore.',
  4),
(@d2, 'Cosa fa il metodo list.append()?',
  'Aggiunge un elemento in fondo alla lista.',
  'append() modifica la lista in-place e ha complessità O(1) ammortizzata.',
  5);
