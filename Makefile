PROJECT = ft_transcendence

# full docker-compose path
# THIS WILL CHANGE UPT TO THE FOLDER path
COMPOSE = /goinfre/${USER}/ft_transcendence/docker-compose.yml

up: 
	docker compose -f ${COMPOSE} up

stop:
	docker compose -f ${COMPOSE} stop

start:
	docker compose -f ${COMPOSE} start

down:
	docker compose -f ${COMPOSE} down --rmi all -v

fclean: down
	docker system prune -af

global: stop fclean up
