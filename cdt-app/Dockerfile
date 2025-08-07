FROM php:8.2-cli

# Habilita SQLite
RUN docker-php-ext-install pdo pdo_sqlite

WORKDIR /var/www

COPY public ./public
COPY scripts ./scripts
COPY data ./data
COPY README.md ./README.md

# Semeia o banco
RUN php scripts/seed_sqlite.php || true

EXPOSE 8080

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]