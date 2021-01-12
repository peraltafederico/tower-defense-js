import EasyStar from 'easystarjs'

export default class Ship {
  scene: Phaser.Scene
  sprite: Phaser.GameObjects.Sprite
  field: Phaser.Tilemaps.StaticTilemapLayer
  finder: EasyStar.js
  map: Phaser.Tilemaps.Tilemap

  constructor(
    scene: Phaser.Scene,
    spriteName: string,
    field: Phaser.Tilemaps.StaticTilemapLayer,
    finder: EasyStar.js,
    map: Phaser.Tilemaps.Tilemap
  ) {
    this.scene = scene
    this.field = field
    this.finder = finder
    this.map = map
    this.sprite = this.scene.add.sprite(64, 0, spriteName, 0)

    this.sprite.setOrigin(0, 0)
    this.arriveEnemyField()
  }

  arriveEnemyField() {
    const fromX = Math.floor(this.sprite.x / 32)
    const fromY = Math.floor(this.sprite.y / 32)
    const toX = 14
    const toY = 19
    console.log(
      'going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')'
    )

    this.finder.findPath(fromX, fromY, toX, toY, path => {
      if (path === null) {
        console.warn('Path was not found.')
      } else {
        console.log(path)
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
        x: { value: ex * this.map.tileWidth, duration: 200 },
        y: { value: ey * this.map.tileHeight, duration: 200 },
      })
    }

    this.scene.tweens.timeline({
      tweens: tweens,
    })
  }
}
