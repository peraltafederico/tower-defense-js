import EasyStar from 'easystarjs'

export default class Tower extends Phaser.GameObjects.Sprite {
  field: Phaser.Tilemaps.DynamicTilemapLayer
  finder: EasyStar.js
  map: Phaser.Tilemaps.Tilemap

  constructor(scene: Phaser.Scene, name: string, toX: number, toY: number) {
    super(scene, toX, toY, name)

    this.scene.add.existing(this)

    this.setOrigin(0, 0)
  }
}
