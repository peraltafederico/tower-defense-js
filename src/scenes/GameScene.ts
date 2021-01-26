/* eslint-disable no-prototype-builtins */
import Phaser from 'phaser'
import Player from '../models/Player'
import Ship from '../models/Ship'
import EasyStar from 'easystarjs'
import { TILES } from '../config/constants'
import Bullets from '../models/Bullets'
import Tower from '../models/Tower'
import { remove } from 'lodash'

export default class HelloWorldScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap
  tiles: Phaser.Tilemaps.Tileset
  marker: Phaser.GameObjects.Graphics
  menu: Phaser.Tilemaps.StaticTilemapLayer
  field: Phaser.Tilemaps.DynamicTilemapLayer
  towerPicker: Phaser.Tilemaps.ObjectLayer
  player: Player
  finder: EasyStar.js
  bullets: Bullets
  enemyShips: Ship[]

  constructor() {
    super('hello-world')
  }

  preload() {
    this.load.image('tileset', 'assets/gridtiles.png')
    this.load.tilemapTiledJSON('map', 'assets/map.json')
    this.load.image('ship_1', 'assets/ship_1.png')
    this.load.image('bullet', 'assets/ship_1.png')
    this.load.image('tower_1', 'assets/towers/tower_1.png')
    this.load.image('tower_2', 'assets/towers/tower_2.png')
    this.load.image('tower_3', 'assets/towers/tower_3.png')
    this.load.image('tower_4', 'assets/towers/tower_4.png')
  }

  create() {
    this.map = this.make.tilemap({ key: 'map' })

    this.tiles = this.map.addTilesetImage('tiles', 'tileset')

    this.field = this.map.createDynamicLayer('field', this.tiles, 0, 0)
    this.menu = this.map.createStaticLayer('menu', this.tiles, 0, 0)

    this.field.setCollisionByProperty({ collides: true })

    this.marker = this.add.graphics()
    this.marker.lineStyle(3, 0xffffff, 1)
    this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight)
    this.marker.setVisible(false)

    this.player = new Player()
    this.enemyShips = []

    this.towerPicker = this.map.getObjectLayer('tower_picker')

    this.towerPicker.objects.forEach(obj => {
      const [tower] = this.map.createFromObjects('tower_picker', obj.name, {
        key: obj.name,
      })

      tower
        .setInteractive()
        .on('pointerdown', () => this.player.pickTower(obj.name))
    })

    this.configPathFinding()

    setInterval(() => {
      this.createShip()
    }, 1000)
  }

  update() {
    remove(this.enemyShips, i => i.visible === false)
    const fieldTile = this.field.getTileAtWorldXY(
      this.input.activePointer.x,
      this.input.activePointer.y
    )

    const menuTile = this.menu.getTileAtWorldXY(
      this.input.activePointer.x,
      this.input.activePointer.y
    )

    const click = this.input.activePointer.isDown

    if (
      fieldTile &&
      (!fieldTile.properties.collides || fieldTile.properties.ship)
    ) {
      const { x: worldX, y: worldY } = this.map.tileToWorldXY(
        fieldTile.x,
        fieldTile.y
      )

      this.showMarker(worldX, worldY)

      if (click) {
        if (this.player.pickedTower) {
          if (fieldTile.index !== TILES.COLLISION_TILE) {
            this.field.putTileAt(TILES.COLLISION_TILE, fieldTile.x, fieldTile.y)
            const newTower = new Tower(
              this,
              this.player.pickedTower,
              fieldTile.pixelX,
              fieldTile.pixelY,
              this.enemyShips
            )

            newTower.setInteractive().on('pointerdown', () => {
              if (!this.player.pickedTower) {
                newTower.destroy()
              }
            })
          }
        } else {
          this.field.putTileAt(TILES.BLANK_TILE, fieldTile.x, fieldTile.y)
        }

        this.configPathFinding()
      }
    }

    if (menuTile) {
      const { x: worldX, y: worldY } = this.map.tileToWorldXY(
        menuTile.x,
        menuTile.y
      )

      this.showMarker(worldX, worldY)

      if (click) {
        const clickOnEmptyTile = !this.towerPicker.objects.some(obj =>
          menuTile.containsPoint(obj.x, obj.y)
        )

        if (clickOnEmptyTile) {
          this.player.unpickTower()
        }
      }
    }
  }

  createShip() {
    const newShip = new Ship(this, 'ship_1', this.finder, this.map)

    this.enemyShips.push(newShip)

    return newShip
  }

  showMarker(x: number, y: number) {
    this.marker.setPosition(x, y)
    this.marker.setVisible(true)
  }

  configPathFinding() {
    this.finder = new EasyStar.js()

    const grid = []

    for (let y = 0; y < 20; y++) {
      const col = []
      for (let x = 0; x < 16; x++) {
        // In each cell we store the ID of the tile, which corresponds
        // to its index in the tileset of the map ("ID" field in Tiled)
        col.push(this.getTileID(x, y))
      }
      grid.push(col)
    }

    this.finder.setGrid(grid)

    const tileset = this.map.tilesets[0]
    const properties = tileset.tileProperties
    const acceptableTiles = []

    // We need to list all the tile IDs that can be walked on. Let's iterate over all of them
    // and see what properties have been entered in Tiled.
    for (let i = tileset.firstgid - 1; i < this.tiles.total; i++) {
      // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
      if (!properties.hasOwnProperty(i)) {
        // If there is no property indicated at all, it means it's a walkable tile
        acceptableTiles.push(i + 1)
        continue
      }
      if (!properties[i].collides) acceptableTiles.push(i + 1)
    }
    this.finder.setAcceptableTiles(acceptableTiles)
  }

  getTileID(x: number, y: number) {
    const tile = this.field.getTileAt(x, y)
    return tile.index
  }
}
