import {
  JsonController, Authorized, CurrentUser, Post, Param, BadRequestError, HttpCode, NotFoundError, ForbiddenError, Get,
  Body, Patch
} from 'routing-controllers'
import User from '../users/entity'
import { Game, Player, Treasure } from './entities'
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

    const treasure = new Treasure()
    treasure.row = Math.floor(Math.random() * 6)
    treasure.column = Math.floor(Math.random() * 6)
    treasure.game = entity
    await treasure.save()

    const treasure1 = new Treasure()
    treasure1.row = Math.floor(Math.random() * 6)
    treasure1.column = Math.floor(Math.random() * 6)
    treasure1.game = entity
    await treasure1.save()

    const treasure2 = new Treasure()
    treasure2.row = Math.floor(Math.random() * 6)
    treasure2.column = Math.floor(Math.random() * 6)
    treasure2.game = entity
    await treasure2.save()

    const treasure3 = new Treasure()
    treasure3.row = Math.floor(Math.random() * 6)
    treasure3.column = Math.floor(Math.random() * 6)
    treasure3.game = entity
    await treasure3.save()

    const treasure4 = new Treasure()
    treasure4.row = Math.floor(Math.random() * 6)
    treasure4.column = Math.floor(Math.random() * 6)
    treasure4.game = entity
    await treasure4.save()

    await Player.create({
      game: entity,
      user,
      symbol: '💰'
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
      symbol: '🐾'
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
      const foundAll: string[] = [""]
      game.board[rowIndex][columnIndex] = '💰'
      if (game.board[rowIndex][columnIndex] = '💰') {
        foundAll.push('💰')
      }
      foundAll.length = 5
      game.status = 'finished'
      game.winner = player.symbol
    } else {
      game.board[rowIndex][columnIndex] = '🐾'
      game.turn = player.symbol === '💰' ? '🐾' : '💰'
    }

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

