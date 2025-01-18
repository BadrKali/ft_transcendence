all:
	clear
	@echo "\n\033[1;33mMake sure you have the .env file in the root directory, if not run 'make env'\033[0m\n"
	docker-compose up --build -d

env:
	@docker-compose -f ./gen/compose.gen.yml up --build -d
	@docker rm -f gen || true
	@mv ./gen/gen/env ./.env
	@echo "\n\033[1;32m.env file created successfully\033[0m\n"

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

prune: clean
	@docker system prune -a --volumes -f

re: clean all

stopelk:
	@docker stop logstash elasticsearch kibana

startelk:
	@docker start elasticsearch kibana logstash

.PHONY: all up down stop start clean re prune