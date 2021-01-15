import Bullet from './Bullet'

export default class Bullets extends Phaser.Physics.Arcade.Group {
  constructor(scene: Phaser.Scene) {
    super(scene.physics.world, scene)

    this.createMultiple({
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet,
    })
  }

  async fireBullet(x: number, y: number, targetX: number, targetY: number) {
    const bullet = this.getFirstDead(true)

    bullet.fire(x, y, targetX, targetY)
  }
}
