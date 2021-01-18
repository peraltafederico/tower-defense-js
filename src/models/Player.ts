export default class Player {
  pickedTower: string

  constructor() {
    this.pickedTower = null
  }

  pickTower(tower: string) {
    this.pickedTower = tower
  }

  unpickTower() {
    this.pickedTower = null
  }
}
