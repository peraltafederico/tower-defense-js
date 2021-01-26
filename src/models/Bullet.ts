export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet')

    this.scene = scene
  }

  fire(x: number, y: number, targetX: number, targetY: number) {
    this.body.reset(x, y)

    this.setActive(true)
    this.setVisible(true)

    this.scene.physics.moveTo(this, targetX, targetY, 800)
  }

  update() {
    console.log('update')
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta)

    if (this.y <= 0) {
      this.setActive(false)
      this.setVisible(false)
    }
  }
}
