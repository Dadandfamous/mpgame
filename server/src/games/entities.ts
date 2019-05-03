import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

export type Symbol = '💰' | '🐾' | null
export type Row = [Symbol | null, Symbol | null, Symbol | null, Symbol | null, Symbol | null, Symbol | null]
export type Board = [Row, Row, Row, Row, Row, Row]
type Status = 'pending' | 'started' | 'finished'

let emptyRow: Row = [null, null, null, null, null, null]

const emptyBoard: Board = [emptyRow, emptyRow, emptyRow, emptyRow, emptyRow, emptyRow]

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', { default: emptyBoard })
  board: Board

  @Column('char', { length: 1, default: '💰' })
  turn: Symbol

  @Column('char', { length: 1, nullable: true })
  winner: Symbol

  @Column('text', { default: 'pending' })
  status: Status

  // @Column('integer')
  // treasureX: number

  // @Column('integer')
  // treasureY: number

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, { eager: true })
  players: Player[]
  @OneToMany(_ => Treasure, treasure => treasure.game, { eager: true })
  treasures: Treasure[];
}

@Entity()
@Index(['game', 'user', 'symbol'], { unique: true })
export class Player extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @ManyToOne(_ => User, user => user.players)
  user: User

  @ManyToOne(_ => Game, game => game.players)
  game: Game

  @Column('char', { length: 1 })
  symbol: Symbol

  @Column('integer', { name: 'user_id' })
  userId: number
}

@Entity()
// @Index(['game', 'user', 'symbol'], { unique: true })
export class Treasure extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(_ => Game, game => game.treasures)
  game: Game;

  @Column('integer')
  row: number

  @Column('integer')
  column: number
}