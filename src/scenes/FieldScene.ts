/* eslint-disable no-prototype-builtins */
import Phaser from 'phaser'
import Player from '../models/Player'
import Ship from '../models/Ship'
import EasyStar from 'easystarjs'

export default class HelloWorldScene extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap
  tiles: Phaser.Tilemaps.Tileset
  marker: Phaser.GameObjects.Graphics
  field: Phaser.Tilemaps.StaticTilemapLayer
  menu: Phaser.Tilemaps.StaticTilemapLayer
  player: Player
  ship: Ship
  finder: EasyStar.js

  constructor() {
    super('hello-world')
  }

  preload() {
    this.load.image('tileset', 'assets/gridtiles.png')
    this.load.tilemapTiledJSON('map', 'assets/map.json')
    this.load.image('ship_1', 'assets/ship_1.png')
    this.load.image('ship_2', 'assets/ship_2.png')
    this.load.image('ship_3', 'assets/ship_3.png')
    this.load.image('ship_4', 'assets/ship_4.png')
  }

  create() {
    this.map = this.make.tilemap({ key: 'map' })

    this.tiles = this.map.addTilesetImage('tiles', 'tileset')

    this.field = this.map.createStaticLayer('field', this.tiles, 0, 0)
    this.menu = this.map.createStaticLayer('menu', this.tiles, 0, 0)

    this.field.setCollisionByProperty({ collides: true })
    // this.matter.world.convertTilemapLayer(this.field)

    this.marker = this.add.graphics()
    this.marker.lineStyle(3, 0xffffff, 1)
    this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight)
    this.marker.setVisible(false)

    this.player = new Player()

    this.configPathFinding()

    this.ship = new Ship(this, 'ship_1', this.field, this.finder, this.map)
    setInterval(() => {
      this.ship = new Ship(this, 'ship_1', this.field, this.finder, this.map)
    }, 1500)
  }

  update() {
    const fieldTile = this.field.getTileAtWorldXY(
      this.input.activePointer.x,
      this.input.activePointer.y
    )
    const menuTile = this.menu.getTileAtWorldXY(
      this.input.activePointer.x,
      this.input.activePointer.y
    )
    const click = this.input.activePointer.isDown

    if (fieldTile && !fieldTile.properties.collides) {
      const worldX = this.map.tileToWorldX(fieldTile.x)
      const worldY = this.map.tileToWorldY(fieldTile.y)

      this.marker.setPosition(worldX, worldY)
      this.marker.setVisible(true)

      if (click && !fieldTile.properties.isShip) {
        if (this.player.pickedShip) {
          fieldTile.properties.isShip = true

          const sprite = this.add
            .sprite(
              worldX + fieldTile.width / 2,
              worldY + fieldTile.height / 2,
              this.player.pickedShip
            )
            .setInteractive()

          sprite.on('pointerdown', function () {
            fieldTile.properties.isShip = false

            sprite.destroy()
          })
        }
      }
    }

    if (menuTile) {
      const worldX = this.map.tileToWorldX(menuTile.x)
      const worldY = this.map.tileToWorldY(menuTile.y)

      this.marker.setPosition(worldX, worldY)
      this.marker.setVisible(true)

      if (click && menuTile.properties.ship) {
        this.player.pickShip(menuTile.properties.ship)
      }

      if (click && !menuTile.properties.ship) {
        this.player.unpickShip()
      }
    }
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
    console.log(properties)
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

  getTileID(x, y) {
    const tile = this.field.getTileAt(x, y)
    return tile.index
  }
}
