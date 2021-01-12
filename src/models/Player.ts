import { SHIPS } from '../config/constants'

export default class Player {
  pickedShip: SHIPS | null

  constructor() {
    this.pickedShip = null
  }

  pickShip(ship: SHIPS) {
    this.pickedShip = ship
  }

  unpickShip() {
    this.pickedShip = null
  }
}
