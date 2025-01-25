WEBAPP_SERVICES = postgres redis backend frontend nginx
ELK_SERVICES = setup elasticsearch kibana logstash
PROM_SERVICES = prometheus grafana nginx-exporter redis-exporter postgres-exporter node-exporter

all:
	@echo "\n\033[1;32mmake up:    \033[0mrun all services"
	@echo "\033[1;32mmake env:   \033[0mgenerate the .env file"
	@echo "\033[1;32mmake web:   \033[0mrun (postgres, redis, backend, frontend, nginx)"
	@echo "\033[1;32mmake elk:   \033[0mrun (postgres, redis, backend, frontend, nginx, setup, elasticsearch, kibana, logstash)"
	@echo "\033[1;32mmake prom:  \033[0mrun (postgres, redis, backend, frontend, nginx, prometheus, grafana, and the exporters)"
	@echo "\033[1;32mmake down:  \033[0mstop and remove all the running containers, and networks"
	@echo "\033[1;32mmake stop:  \033[0mstop all the running containers"
	@echo "\033[1;32mmake start: \033[0mstart all the stopped containers"
	@echo "\033[1;32mmake clean: \033[0mstop and remove all the running containers, images, volumes, and networks"
	@echo "\033[1;32mmake re:    \033[0mclean and run all services"
	@echo "\033[1;32mmake prune: \033[0mclean and remove all cached data\n"

up:
	@test -f .env || ( echo "\n\033[1;33mError: .env not found, run 'make env'\033[0m\n"; exit 1 )
	clear
	docker-compose up --build -d

env:
	@docker-compose -f ./gen/compose.gen.yml up --build -d
	@docker rm -f gen || true
	@mv ./gen/gen/env ./.env
	@echo "\n\033[1;32m.env file created successfully\033[0m\n"

web:
	@test -f .env || ( echo "\n\033[1;33mError: .env not found, run 'make env'\033[0m\n"; exit 1 )
	clear
	@docker-compose up --build -d $(WEBAPP_SERVICES)

elk:
	@test -f .env || ( echo "\n\033[1;33mError: .env not found, run 'make env'\033[0m\n"; exit 1 )
	clear
	@docker-compose up --build -d $(WEBAPP_SERVICES) $(ELK_SERVICES)

prom:
	@test -f .env || ( echo "\n\033[1;33mError: .env not found, run 'make env'\033[0m\n"; exit 1 )
	clear
	@docker-compose up --build -d $(WEBAPP_SERVICES) $(PROM_SERVICES)

down:
	docker-compose down

stop:
	docker-compose stop

start:
	docker-compose start

clean:
	@docker stop $$(docker ps -qa) || true
	@docker rm -f $$(docker ps -qa) || true
	@docker rmi -f $$(docker images -qa) || true
	@docker volume rm -f $$(docker volume ls -q) || true
	@docker network rm $$(docker network ls -q) || true

re: clean all

prune: clean
	@docker system prune -a --volumes -f

.PHONY: all env web elk prom down stop start clean re prune info
