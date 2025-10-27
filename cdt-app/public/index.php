<?php
session_start();

// Simples mock de usuários (em produção usar DB). Também leremos de SQLite se existir
$dbPath = __DIR__ . '/../data/cdt.sqlite';
$defaultUser = [
    'cpf' => '04633333375',
    'senha' => '123456',
];

if (!file_exists($dbPath)) {
    // Banco ausente — seguirá com mock
    $user = $defaultUser;
} else {
    try {
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $pdo->query("SELECT cpf, senha FROM usuarios LIMIT 1");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $user = $row ?: $defaultUser;
    } catch (Throwable $e) {
        $user = $defaultUser;
    }
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cpf = preg_replace('/\D/', '', $_POST['cpf'] ?? '');
    $senha = $_POST['senha'] ?? '';

    if ($cpf === ($user['cpf'] ?? '') && $senha === ($user['senha'] ?? '')) {
        $_SESSION['user_cpf'] = $cpf;
        header('Location: /dashboard.php');
        exit;
    } else {
        $error = 'CPF ou senha inválidos';
    }
}
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CDT - Login</title>
  <link rel="stylesheet" href="/assets/styles.css" />
</head>
<body class="bg-light">
  <header class="topbar">
    <div class="topbar-inner">
      <button class="menu-btn" aria-label="menu"><span></span><span></span><span></span></button>
      <h1 class="topbar-title">CDT</h1>
      <div class="topbar-actions">
        <span class="bell" aria-hidden="true">🔔</span>
        <div class="avatar">D</div>
      </div>
    </div>
  </header>

  <main class="container narrow">
    <section class="card p-xl">
      <h2 class="mb-m">Acesse sua conta</h2>
      <?php if ($error): ?>
        <div class="alert error"><?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>
      <form method="post" class="form-grid">
        <label>
          <span>CPF</span>
          <input type="text" name="cpf" inputmode="numeric" placeholder="Digite seu CPF" required />
        </label>
        <label>
          <span>Senha</span>
          <input type="password" name="senha" placeholder="Sua senha" required />
        </label>
        <button type="submit" class="btn primary w-100">Entrar</button>
      </form>
      <p class="muted mt-m">Use CPF 04633333375 e senha 123456 para testar, a menos que você tenha inicializado o banco.</p>
    </section>
  </main>

  <script src="/assets/app.js"></script>
</body>
</html>