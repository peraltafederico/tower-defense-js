export default class Player {
  pickedShip: Phaser.Tilemaps.Tile | null

  constructor() {
    this.pickedShip = null
  }

  pickShip(ship: Phaser.Tilemaps.Tile) {
    this.pickedShip = ship
  }

  unpickShip() {
    this.pickedShip = null
  }
}
