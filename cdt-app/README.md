# CDT Web (Demo)

App web em PHP que replica a navegação das telas das imagens: login → dashboard (apenas "Condutor" ativo) → condutor → habilitação.

## Executar local (sem Docker)

1) Popular banco SQLite (opcional, mas recomendado):

```
php scripts/seed_sqlite.php
```

2) Subir servidor embutido do PHP:

```
php -S localhost:8080 -t public
```

3) Acesse `http://localhost:8080`.

- Usuário demo: CPF `04633333375` e senha `123456`.
- Sem o banco, o app usa mocks embutidos.

## Gerar link público (Docker + Cloudflared)

Pré-requisitos: Docker e Docker Compose.

```
make up           # sobe o app e o túnel
make logs         # opcional: ver logs
make url          # imprime a URL pública (*.trycloudflare.com)
```

Abra a URL no celular. Para parar:

```
make stop
```