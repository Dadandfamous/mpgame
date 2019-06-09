# 🐶 Multiplayer Treasurehunt Extreme 🐶

## What this project is about

This a 2-person attempt at the week 4 React/Redux group project the students do during the Academy. For more info why I am doing this, checkout: **[Goals for this project](#goals-for-this-project)**

This game consist of a frontend and backend for a multiplayer game. It uses Typescript, Koa, routing-controllers and TypeORM in the backend and React/Redux in the frontend. The backend exposes a REST API but also sends messages over websockets using SocketIO. 

Short ingame demo: 

![](TREASUREHUNT_EXTREME_DEMO.gif)

The first player that finds 5 treasures, wins. In this example, you see the the first treasure discovery.

## Table of contents:

- **[Technologies used](#technologies-used)**
- **[Goals for this project](#goals-for-this-project)**
- **[Requirements briefing](#requirements)**
- **[My git workflow](#my-git-workflow)**
- **[My agile workflow and trello board](#my-agile-workflow-and-trello-board)**
- **[create-react-app-docs](#create-react-app)**
- **[Running the game](#running-the-game)**

## Technologies used

#### 👀👇 Click links to view some samples in this project 👇👀

- **[react](./client/src/components/GameDetails.js)**  
- **[redux](./client/src/reducers/games.js)**  
- **[typeORM](./server/src/games/controller.ts)**  

## Goals for this project:

- General practice on building a fullstack app with many interactions, in a group of students.
- **[To showcase disciplined git usage](#git-workflow)**

## Git workflow

In this project we tried to use:

- Good commit messages
- Well named branches
- Pull requests with summaries

If you have feedback to improve the git usage: **[please drop a line!](https://www.linkedin.com/in/martin-braun-100/)** 

Here is the branching model for this project.

```
master (auto deploys) ______________________
                       \               /
development             \_____________/- pull request
                         \           /
feature/some-feature      \_commits_/- pull request
```

## Create React App

This project was scaffolded using the create-react-app cli. 

**[The standard create-react-app docs can be found in here](./create-react-app-docs.md)**



## Running the game

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

===> BEFORE starting the server for the first time, comment out the following lines 53 & 54:

    server/src/games/entities.ts :

    @Column('integer', { name: 'user_id' })
    userId: number

Start the server with the `npm run dev`

Comment the 2 lines back in again in entities.ts and save (should automatically restart server)

### React Client

Open another terminal session and `cd` into the `client` directory, then run `npm install` to install dependencies and run `npm start` to start the dev server.

### Ingame

PLAYER 1:
- Open browser (preference Google Chrome)
- address http://localhost:3000 
- create account
- sign in
- => Create game 
- join

PLAYER 2:
- Open browser in private / incognito window
- address http://localhost:3000 
- create account
- sign in
- watch

Happy digging!