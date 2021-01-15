import EasyStar from 'easystarjs'

export default class Ship {
  scene: Phaser.Scene
  sprite: Phaser.GameObjects.Sprite
  field: Phaser.Tilemaps.DynamicTilemapLayer
  finder: EasyStar.js
  map: Phaser.Tilemaps.Tilemap

  constructor(
    scene: Phaser.Scene,
    spriteName: string,
    field: Phaser.Tilemaps.DynamicTilemapLayer,
    finder: EasyStar.js,
    map: Phaser.Tilemaps.Tilemap
  ) {
    this.scene = scene
    this.field = field
    this.finder = finder
    this.map = map
    this.sprite = this.scene.add.sprite(32 * 8, 0, spriteName, 0)

    this.sprite.setOrigin(0, 0)
    this.arriveEnemyField()
  }

  getSprite() {
    return this.sprite
  }

  arriveEnemyField() {
    const fromX = Math.floor(this.sprite.x / 32)
    const fromY = Math.floor(this.sprite.y / 32)
    const toX = 8
    const toY = 19

    this.finder.findPath(fromX, fromY, toX, toY, path => {
      if (path === null) {
        console.warn('Path was not found.')
      } else {
        this.move(path)
      }
    })
    this.finder.calculate() // don't forget, otherwise nothing happens
  }

  move(path) {
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    const tweens = []

    for (let i = 0; i < path.length - 1; i++) {
      const ex = path[i + 1].x
      const ey = path[i + 1].y
      tweens.push({
        targets: this.sprite,
        x: { value: ex * this.map.tileWidth, duration: 1000 },
        y: { value: ey * this.map.tileHeight, duration: 1000 },
      })
    }

    this.scene.tweens.timeline({
      tweens: tweens,
      onComplete: () => this.sprite.destroy(),
    })
  }
}
