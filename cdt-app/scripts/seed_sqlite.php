<?php
// Executar: php scripts/seed_sqlite.php
$root = dirname(__DIR__);
$dbFile = $root . '/data/cdt.sqlite';
@mkdir($root . '/data', 0777, true);

$pdo = new PDO('sqlite:' . $dbFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$pdo->exec('PRAGMA journal_mode = wal');

$pdo->exec('CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cpf TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
)');

$pdo->exec('CREATE TABLE IF NOT EXISTS condutores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cpf TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  cpf_mascarado TEXT NOT NULL,
  sexo TEXT,
  categoria TEXT,
  uf_emissao TEXT,
  dt_validade TEXT,
  dt_emissao TEXT
)');

$pdo->exec('CREATE TABLE IF NOT EXISTS cnh (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cpf TEXT UNIQUE NOT NULL,
  numero_registro TEXT,
  nome TEXT,
  categoria TEXT,
  validade TEXT,
  emissao TEXT,
  uf TEXT
)');

$cpf = '04633333375';
$pdo->prepare('INSERT OR REPLACE INTO usuarios (cpf, senha) VALUES (?, ?)')
    ->execute([$cpf, '123456']);

$pdo->prepare('INSERT OR REPLACE INTO condutores (cpf, nome, cpf_mascarado, sexo, categoria, uf_emissao, dt_validade, dt_emissao) VALUES (?,?,?,?,?,?,?,?)')
    ->execute([$cpf, 'Daniel W***** B****** D** S***** V*****', '046.***.***-75', 'MASCULINO', 'AB', 'RO', '31/08/2025', '15/09/2023']);

$pdo->prepare('INSERT OR REPLACE INTO cnh (cpf, numero_registro, nome, categoria, validade, emissao, uf) VALUES (?,?,?,?,?,?,?)')
    ->execute([$cpf, '01234567890', 'Daniel W***** B****** D** S***** V*****', 'AB', '31/08/2025', '15/09/2023', 'RO']);

echo "SQLite seed concluído em $dbFile\n";