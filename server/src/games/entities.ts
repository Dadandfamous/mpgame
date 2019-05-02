import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Index, OneToMany, ManyToOne } from 'typeorm'
import User from '../users/entity'

export type Symbol = 'x' | 'o' | null
export type Row = [Symbol | null, Symbol | null, Symbol | 'x']
export type Board = [Row, Row, Row]
type Status = 'pending' | 'started' | 'finished'

let emptyRow: Row = [null, null, null]
// export function randomMe() {
//   function shuffle(array) {
//     var currentIndex = array.length, temporaryValue, randomIndex;

//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {

//       // Pick a remaining element...
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex -= 1;

//       // And swap it with the current element.
//       temporaryValue = array[currentIndex];
//       array[currentIndex] = array[randomIndex];
//       array[randomIndex] = temporaryValue;
//     }
//     return array;
//   }

//   let emptyRow1: Row = [null, null, 'x']
//   emptyRow1 = shuffle(emptyRow1)

//   let emptyRow2: Row = [null, null, 'x']
//   emptyRow2 = shuffle(emptyRow2)

//   let emptyRow3: Row = [null, null, 'x']
//   emptyRow3 = shuffle(emptyRow3)

//   let emptyBoardFunc: Board = [emptyRow1, emptyRow2, emptyRow3]

//   return emptyBoardFunc
// }
const emptyBoard: Board = [emptyRow, emptyRow, emptyRow]

@Entity()
export class Game extends BaseEntity {

  @PrimaryGeneratedColumn()
  id?: number

  @Column('json', { default: emptyBoard })
  board: Board

  @Column('char', { length: 1, default: 'x' })
  turn: Symbol

  @Column('char', { length: 1, nullable: true })
  winner: Symbol

  @Column('text', { default: 'pending' })
  status: Status

  @Column('integer')
  treasureX: number

  @Column('integer')
  treasureY: number

  // this is a relation, read more about them here:
  // http://typeorm.io/#/many-to-one-one-to-many-relations
  @OneToMany(_ => Player, player => player.game, { eager: true })
  players: Player[]
}
// @Entity()
// export class Game extends BaseEntity {

//   @PrimaryGeneratedColumn()
//   id?: number

//   @Column('json', { default: emptyBoard })
//   board: Board

//   @Column('char', { length: 1, default: 'x' })
//   turn: Symbol

//   @Column('char', { length: 1, nullable: true })
//   winner: Symbol

//   @Column('text', { default: 'pending' })
//   status: Status

//   // this is a relation, read more about them here:
//   // http://typeorm.io/#/many-to-one-one-to-many-relations
//   @OneToMany(_ => Player, player => player.game, { eager: true })
//   players: Player[]
// }

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

  // @Column('integer', { name: 'user_id' })
  // userId: number
}
