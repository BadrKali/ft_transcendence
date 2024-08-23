PROJECT = ft_transcendence

VFOLDER = ${HOME}/goinfre/VOLUMES
# stand For volume Folders

# full docker-compose path
COMPOSE = ${HOME}/Desktop/ft_transcendence/docker-compose.yml

# COMPOSE = /home/abait-ta/Desktop/Inception-42Project-1337-Morroco-/srcs/docker-compose.yml

folders:
	mkdir -p  ${VFOLDER}
	mkdir -p  ${VFOLDER}/frontend
	mkdir -p  ${VFOLDER}/backend
	mkdir -p  ${VFOLDER}/postgres
	chmod 777 ${VFOLDER} ${VFOLDER}/frontend ${VFOLDER}/backend ${VFOLDER}/postgres

up: folders
	docker compose -f ${COMPOSE} up

stop:
	docker compose -f ${COMPOSE} stop
start:
	docker compose -f ${COMPOSE} start
down:
	docker compose -f ${COMPOSE} down --rmi all -v
fclean: down
	docker system prune -af
	rm -rf ${VFOLDER}

global: stop fclean up
