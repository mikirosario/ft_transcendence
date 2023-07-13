all:
	@cd ./srcs/ && docker-compose up --build

resume:
	@echo "STARTING CONTAINERS...\n"
	@cd ./srcs/ && docker-compose up -d

stop:
	@cd ./srcs/ && docker-compose down
	@echo "CONTAINERS STOPPED!\n"

clean:
	@echo "System cleaned!"
	-docker-compose -f ./srcs/docker-compose.yml --env-file srcs/.env down -v --rmi all
	-docker system prune -af

fclean: clean
	@echo "System deeply cleaned!"

front:
	@echo "STARTING FRONT...\n"
	@cd ./srcs/front && npm start

back:
	@echo "STARTING BACK...\n"
	@cd ./srcs/front && npm run start:dev

database:
	@cd ./srcs/front && npm run db:dev:remove
	@echo "Database created succesfully..."

database-stop:

prune:
	@echo "System pruned!"
	docker system prune -f

.PHONY: all resume stop clean fclean front back database prune