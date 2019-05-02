import {
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get,
  Body, Patch
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Player, Board, Treasure } from './entities'
import { io } from '../index'

@JsonController()
export default class GameController {

  @Authorized()
  @Post('/games')
  @HttpCode(201)
  async createGame(
    @CurrentUser() user: User
  ) {
    const entity = new Game()
    await entity.save()
    //entity.board = randomMe()
    // console.log("aaaaaahhhh", entity.treasures)
    // entity.treasure.treasureX = Math.floor(Math.random() * 6)
    // entity.treasure.treasureY = Math.floor(Math.random() * 6)

    const treasure = new Treasure()
    treasure.row = Math.floor(Math.random() * 6)
    treasure.column = Math.floor(Math.random() * 6)
    treasure.game = entity
    console.log('aaaahhhhhh', treasure)
    await treasure.save()

    const treasure2 = new Treasure()
    treasure2.row = Math.floor(Math.random() * 6)
    treasure2.column = Math.floor(Math.random() * 6)
    treasure2.game = entity
    console.log('aaaahhhhhhhhhh', treasure2)
    await treasure2.save()

    await Player.create({
      game: entity,
      user,
      symbol: 'x'
    }).save()

    const game = await Game.findOneById(entity.id)

    io.emit('action', {
      type: 'ADD_GAME',
      payload: game
    })

    return game
  }

  @Authorized()
  @Post('/games/:id([0-9]+)/players')
  @HttpCode(201)
  async joinGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new BadRequestError(`Game does not exist`)
    if (game.status !== 'pending') throw new BadRequestError(`Game is already started`)

    game.status = 'started'
    await game.save()

    const player = await Player.create({
      game,
      user,
      symbol: 'o'
    }).save()

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: await Game.findOneById(game.id)
    })

    return player
  }

  @Authorized()
  // the reason that we're using patch here is because this request is not idempotent
  // http://restcookbook.com/HTTP%20Methods/idempotency/
  // try to fire the same requests twice, see what happens
  @Patch('/games/:id([0-9]+)')
  async updateGame(
    @CurrentUser() user: User,
    @Param('id') gameId: number,
    @Body() update: number[]
  ) {
    const game = await Game.findOneById(gameId)
    if (!game) throw new NotFoundError(`Game does not exist`)

    const player = await Player.findOne({ user, game })

    if (!player) throw new ForbiddenError(`You are not part of this game`)
    if (game.status !== 'started') throw new BadRequestError(`The game is not started yet`)
    if (player.symbol !== game.turn) throw new BadRequestError(`It's not your turn`)

    // ATTENTION //////////////
    // this connects the frontend input with the predefined location of the treasure:
    const rowIndex = update[0]
    const columnIndex = update[1]

    const isCorrect = game
      .treasures
      .some(treasure => {
        const correctRow = rowIndex === treasure.row
        const correctColumn = columnIndex === treasure.column

        return correctRow && correctColumn
      })
    console.log('isCorrect test:', isCorrect)

    if (isCorrect) {
      game.board[rowIndex][columnIndex] = 'x'
      game.status = 'finished'
      game.winner = player.symbol
    } else {
      game.board[rowIndex][columnIndex] = 'o'
      game.turn = player.symbol === 'x' ? 'o' : 'x'
    }
    console.log('game.board test:', game.board)

    await game.save()

    io.emit('action', {
      type: 'UPDATE_GAME',
      payload: game
    })

    return game
  }

  @Authorized()
  @Get('/games/:id([0-9]+)')
  getGame(
    @Param('id') id: number
  ) {
    return Game.findOneById(id)
  }

  @Authorized()
  @Get('/games')
  getGames() {
    return Game.find()
  }
}

