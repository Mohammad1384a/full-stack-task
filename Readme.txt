** Note that Env files are intentionally not ignored for the ease of set up.
After Cloning the app follow the steps below to run the app locally.
1.make sure you have docker(on linux containers) and optionally MySql workbranch installed on your machine.
2.run "docker compose up -d --build" in a terminal with the path of api app's directory
3.run the comands below for seeding and setting up migration
"
docker compose exec api npm run build
docker compose exec api npm run migration:run:dist
docker compose exec api npm run seed:dist
"
4.run "run npm install" in a terminal opened in frontend app's directory
5.the default admin credentials are
admin@example.com
admin123

Brief introduction of app's functionalities.
There are only 2 roles(admin and user) in the app. where admin can create and assign tasks to any user and later on edit it. a user cannot have 2 overlapping tasks at the same time. when a task is created for a user he/she will get notified through socket with jobs(for testing that please open the app on two different browsers and with one of the create the task as admin and on the other one log in as user).
you can filter and search on tasks.
only admin can create tasks for other users and users can only create/edit tasks for themselves