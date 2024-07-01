**This is the example code from the presentation!**

**In order to run the appliation you have to complete the following steps:**

1. **Create .env file which should look like this:**

PG_HOST={Postgre host} - (Example value: PG_HOST=localhost)

PG_PORT={Postge port} - (Example value: PG_PORT=5432)

PG_DATABASE={Your DB name} - (Example value: PG_DATABASE=cache-demo)

PG_USER={DB username} - (Example value: PG_USER=admin)

PG_PASSWORD={DB passward} - (Example value: PG_PASSWORD=P@ssW0rd)

PORT={The port on which the application will listen} - (Example value: PORT=8000)

2. **Run Redis Server locally on Docker:**

   - `docker run -d --name my-redis-stack -p 6379:6379  redis/redis-stack-server:latest`

  The command above will start instance of a Redis server locally.

3. **(Optional) Create Docker compose file for the database or install one locally:**

- Here it is an example docker-compose file for PostgeSQL server

`version: '3.8'

services:
  postgres:
    image: postgres:latest
    container_name: my_postgres
    restart: always
    environment:
      POSTGRES_DB: my_database
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: P@ssw0rd
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`


4. **Install the dependencies:**

   - `npm run i`
7. **Run the application:**

   - `npm run start`
