PROJECT = ft_transcendence

Get_Host=${HOST}

COMPOSE = /Users/mohamed/Desktop/ft_transcendence/docker-compose.yml

COMPOSEGOINFRE = /goinfre/${USER}/ft_transcendence/docker-compose.yml

ifeq ($(filter ${USER},abait-ta bel-kala youlhafi mhabib-a),)
    COMPOSEFILE = $(COMPOSE)
else
    COMPOSEFILE = $(COMPOSEGOINFRE)
endif

up: 
	docker compose -f ${COMPOSEFILE} up

stop:
	docker compose -f ${COMPOSEFILE} stop

start:
	docker compose -f ${COMPOSEFILE} start

down:
	docker compose -f ${COMPOSEFILE} down --rmi all -v

fclean: down
	docker system prune -af

global: stop fclean up
