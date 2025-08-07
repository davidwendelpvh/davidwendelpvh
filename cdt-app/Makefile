up:
	docker compose up -d --build

logs:
	docker compose logs -f --tail=200

url:
	@echo "Aguarde alguns segundos e pegue a URL abaixo (trycloudflare.com) nas logs do serviço 'tunnel':"
	@docker compose logs tunnel --tail=200 | sed -n 's/.*https:\/\/\(.*trycloudflare.com\).*/https:\/\/\1/p' | tail -n 1

stop:
	docker compose down