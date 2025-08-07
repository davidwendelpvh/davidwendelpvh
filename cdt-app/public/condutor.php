<?php
session_start();
if (!isset($_SESSION['user_cpf'])) {
    header('Location: /index.php');
    exit;
}

$dbPath = __DIR__ . '/../data/cdt.sqlite';
$condutor = [
    'nome' => 'D*** W***** B****** D** S***** V*****',
    'cpf' => '046.***.***-75',
    'sexo' => 'MASCULINO',
    'categoria' => 'AB',
    'uf_emissao' => 'RO',
    'dt_validade' => '31/08/2025',
    'dt_emissao' => '15/09/2023',
];

if (file_exists($dbPath)) {
    try {
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $pdo->prepare('SELECT nome, cpf_mascarado as cpf, sexo, categoria, uf_emissao, dt_validade, dt_emissao FROM condutores WHERE cpf = :cpf LIMIT 1');
        $stmt->execute([':cpf' => $_SESSION['user_cpf']]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $condutor = $row;
        }
    } catch (Throwable $e) {
        // usa mock
    }
}
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CDT - Condutor</title>
  <link rel="stylesheet" href="/assets/styles.css" />
</head>
<body class="bg-light">
  <header class="topbar">
    <div class="topbar-inner">
      <a class="back" href="/dashboard.php" aria-label="voltar">◀</a>
      <h1 class="topbar-title">CONDUTOR</h1>
      <div class="topbar-actions"></div>
    </div>
  </header>

  <main class="container">
    <section class="card p-xl">
      <h2 class="mb-m">Informações do Condutor</h2>
      <div class="grid-2">
        <div>
          <div class="field"><span class="label">Nome</span><span class="value"><?php echo htmlspecialchars($condutor['nome']); ?></span></div>
          <div class="field"><span class="label">CPF</span><span class="value"><?php echo htmlspecialchars($condutor['cpf']); ?></span></div>
          <div class="field"><span class="label">Categoria</span><span class="value"><?php echo htmlspecialchars($condutor['categoria']); ?></span></div>
          <div class="field"><span class="label">Data de Validade</span><span class="value"><?php echo htmlspecialchars($condutor['dt_validade']); ?></span></div>
        </div>
        <div>
          <div class="field"><span class="label">Sexo</span><span class="value"><?php echo htmlspecialchars($condutor['sexo']); ?></span></div>
          <div class="field"><span class="label">UF de Emissão</span><span class="value"><?php echo htmlspecialchars($condutor['uf_emissao']); ?></span></div>
          <div class="field"><span class="label">Data de Emissão</span><span class="value"><?php echo htmlspecialchars($condutor['dt_emissao']); ?></span></div>
        </div>
      </div>
    </section>

    <section class="actions-grid">
      <a href="/habilitacao.php" class="action-card">
        <div class="icon">🪪</div>
        <div class="title">HABILITAÇÃO</div>
      </a>
      <div class="action-card disabled" role="button" tabindex="0">
        <div class="icon">✅</div>
        <div class="title">CADASTRO POSITIVO</div>
      </div>
      <div class="action-card disabled" role="button" tabindex="0">
        <div class="icon">🧪</div>
        <div class="title">EXAMES TOXICOLÓGICOS</div>
      </div>
      <div class="action-card disabled" role="button" tabindex="0">
        <div class="icon">📑</div>
        <div class="title">CURSOS ESPECIALIZADOS</div>
      </div>
      <div class="action-card disabled" role="button" tabindex="0">
        <div class="icon">🅿️</div>
        <div class="title">CREDENCIAL DE ESTACIONAMENTO</div>
      </div>
    </section>
  </main>

  <script src="/assets/app.js"></script>
</body>
</html>