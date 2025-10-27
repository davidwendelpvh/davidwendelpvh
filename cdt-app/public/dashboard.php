<?php
session_start();
if (!isset($_SESSION['user_cpf'])) {
    header('Location: /index.php');
    exit;
}
?>
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CDT - Início</title>
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

  <main class="container">
    <div class="cards-grid">
      <a class="tile tile-green" href="/condutor.php">
        <div class="tile-title">CONDUTOR</div>
        <div class="tile-sub">Gerencie sua <strong>habilitação</strong></div>
        <div class="tile-icon">🚗</div>
      </a>

      <div class="tile tile-yellow" role="button" tabindex="0" data-disabled="true">
        <div class="tile-title">VEÍCULOS</div>
        <div class="tile-sub">Acesso ao <strong>CRLV-e</strong>, venda digital</div>
        <div class="tile-icon">🚙</div>
      </div>

      <div class="tile tile-blue" role="button" tabindex="0" data-disabled="true">
        <div class="tile-title">INFRAÇÕES</div>
        <div class="tile-sub">Visualize e pague infrações com até <strong>40% de desconto</strong></div>
        <div class="tile-icon">👮</div>
      </div>

      <div class="tile tile-sky" role="button" tabindex="0" data-disabled="true">
        <div class="tile-title">EDUCAÇÃO</div>
        <div class="tile-sub">Conheça nossas <strong>campanhas e projetos</strong></div>
        <div class="tile-icon">🎓</div>
      </div>
    </div>

    <p class="muted center mt-l">Apenas a opção verde está ativa. As demais são apenas visual.</p>
    <form method="post" action="/logout.php" class="center mt-xl">
      <button class="btn">Sair</button>
    </form>
  </main>

  <script src="/assets/app.js"></script>
</body>
</html>