import EasyStar from 'easystarjs'
import { TILE_WIDTH } from '../config/constants'

export default class Ship extends Phaser.Physics.Arcade.Sprite {
  finder: EasyStar.js
  map: Phaser.Tilemaps.Tilemap

  constructor(
    scene: Phaser.Scene,
    spriteName: string,
    finder: EasyStar.js,
    map: Phaser.Tilemaps.Tilemap,
  ) {
    super(scene, TILE_WIDTH * 8, 0, spriteName)

    this.finder = finder
    this.map = map

    this.scene.add.existing(this)

    this.scene.physics.add.existing(this)

    this.setOrigin(0, 0)
    this.arriveEnemyField()
  }

  arriveEnemyField() {
    const fromX = Math.floor(this.x / TILE_WIDTH)
    const fromY = Math.floor(this.y / TILE_WIDTH)
    const toX = 8
    const toY = 19

    this.finder.findPath(fromX, fromY, toX, toY, path => {
      if (path === null) {
        this.destroy()
        console.warn('Path was not found.')
      } else {
        this.move(path)
      }
    })
    this.finder.calculate()
  }

  move(path) {
    const tweens = []

    for (let i = 0; i < path.length - 1; i++) {
      const ex = path[i + 1].x
      const ey = path[i + 1].y
      tweens.push({
        targets: this,
        x: { value: ex * this.map.tileWidth, duration: 300 },
        y: { value: ey * this.map.tileHeight, duration: 300 },
      })
    }

    this.scene.tweens.timeline({
      tweens: tweens,
      onComplete: () => {
        this.destroy()
      },
    })
  }
}
