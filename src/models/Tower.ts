import EasyStar from 'easystarjs'
import Bullets from './Bullets'
import Ship from './Ship'

export default class Tower extends Phaser.GameObjects.Sprite {
  field: Phaser.Tilemaps.DynamicTilemapLayer
  finder: EasyStar.js
  map: Phaser.Tilemaps.Tilemap
  bullets: Bullets
  enemyShips: Ship[]
  closest: any

  constructor(
    scene: Phaser.Scene,
    name: string,
    toX: number,
    toY: number,
    enemyShips: Ship[]
  ) {
    super(scene, toX, toY, name)
    this.enemyShips = enemyShips

    this.scene.add.existing(this)

    this.setOrigin(0, 0)
    this.bullets = new Bullets(this.scene)

    this.scene.events.on('update', this.update.bind(this))

    this.scene.physics.add.overlap(
      this.bullets,
      this.enemyShips,
      (ship, bullet) => {
        bullet.destroy()
      }
    )

    setInterval(() => {
      this.fire()
    }, 300)
  }

  fire() {
    this.closest = this.scene.physics.closest(this, this.enemyShips)

    this.bullets.fireBullet(this.x, this.y, this.closest.x, this.closest.y)
  }

  update() {
    // TODO: Find a way to do this
    // this.closest = this.scene.physics.closest(this, this.enemyShips)
  }
}
