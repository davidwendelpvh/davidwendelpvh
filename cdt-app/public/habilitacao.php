<?php
session_start();
if (!isset($_SESSION['user_cpf'])) {
    header('Location: /index.php');
    exit;
}

$dbPath = __DIR__ . '/../data/cdt.sqlite';
$cnh = [
    'numero_registro' => '01234567890',
    'nome' => 'D*** W***** B****** D** S***** V*****',
    'categoria' => 'AB',
    'validade' => '31/08/2025',
    'emissao' => '15/09/2023',
    'uf' => 'RO',
];

if (file_exists($dbPath)) {
    try {
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $pdo->prepare('SELECT numero_registro, nome, categoria, validade as validade, emissao as emissao, uf FROM cnh WHERE cpf = :cpf LIMIT 1');
        $stmt->execute([':cpf' => $_SESSION['user_cpf']]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $cnh = $row;
        }
    } catch (Throwable $e) {
        // mock
    }
}
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CDT - Habilitação</title>
  <link rel="stylesheet" href="/assets/styles.css" />
</head>
<body class="bg-light">
  <header class="topbar">
    <div class="topbar-inner">
      <a class="back" href="/condutor.php" aria-label="voltar">◀</a>
      <h1 class="topbar-title">HABILITAÇÃO</h1>
      <div class="topbar-actions"></div>
    </div>
  </header>

  <main class="container">
    <section class="cnh-card">
      <div class="cnh-header">
        <span class="cnh-title">CARTEIRA NACIONAL DE HABILITAÇÃO</span>
        <span class="cnh-uf"><?php echo htmlspecialchars($cnh['uf']); ?></span>
      </div>
      <div class="cnh-body">
        <div class="cnh-photo" aria-hidden="true">👤</div>
        <div class="cnh-fields">
          <div><span class="label">Registro</span><span class="value"><?php echo htmlspecialchars($cnh['numero_registro']); ?></span></div>
          <div><span class="label">Nome</span><span class="value"><?php echo htmlspecialchars($cnh['nome']); ?></span></div>
          <div class="grid-2">
            <div><span class="label">Categoria</span><span class="value"><?php echo htmlspecialchars($cnh['categoria']); ?></span></div>
            <div><span class="label">UF</span><span class="value"><?php echo htmlspecialchars($cnh['uf']); ?></span></div>
          </div>
          <div class="grid-2">
            <div><span class="label">Emissão</span><span class="value"><?php echo htmlspecialchars($cnh['emissao']); ?></span></div>
            <div><span class="label">Validade</span><span class="value"><?php echo htmlspecialchars($cnh['validade']); ?></span></div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <script src="/assets/app.js"></script>
</body>
</html>