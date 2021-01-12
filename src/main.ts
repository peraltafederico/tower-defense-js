import Phaser from 'phaser'

import FieldScene from './scenes/FieldScene'

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 640,
  scene: [FieldScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
}

export default new Phaser.Game(config)
