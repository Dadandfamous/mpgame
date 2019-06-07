# 🐶 Multiplayer Treasurehunt Extreme 🐶
This repo contains a frontend and backend for a multiplayer tic tac toe game. It uses Typescript, Koa, routing-controllers and TypeORM in the backend and React/Redux in the frontend. The backend exposes a REST API but also sends messages over websockets using SocketIO. 

## Getting Started

### Postgres Database

Start a Postgres container using the following Docker command:

```bash
$ docker run \
  --rm \
  -e POSTGRES_PASSWORD=secret \
  -p 5432:5432 \
  postgres
```

### TypeStack Server

Then `cd` into the `server` directory and run `npm install` to install the dependencies.

===> BEFORE starting the server for the first time, comment out the following lines 61 & 62:

    server/src/games/entities.ts :

    @Column('integer', { name: 'user_id' })
    userId: number

Start the server with the `npm run dev`

Comment the 2 lines back in again in entities.ts and save (should automatically restart server)

### React Client

Open another terminal session and `cd` into the `client` directory, then run `npm install` to install dependencies and run `npm start` to start the dev server.

### Ingame

Open browser (preference Google Chrome)
address http://localhost:3000 
create account
sign in
=> Create game 
join

Open browser in private / incognito window
address http://localhost:3000 
create account
sign in
watch

Good luck!