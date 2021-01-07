import Phaser from 'phaser'
import { TILE_HEIGHT, TILE_WIDTH } from '../config/constants'
import Player from '../models/Player'

// TODO: Add lint :(

export default class HelloWorldScene extends Phaser.Scene {
    map: Phaser.Tilemaps.Tilemap
    tiles: Phaser.Tilemaps.Tileset
    marker: Phaser.GameObjects.Graphics
    field: Phaser.Tilemaps.StaticTilemapLayer
    menu: Phaser.Tilemaps.StaticTilemapLayer
    player: Player

    constructor() {
        super('hello-world')
    }

    preload() {
        this.load.image('tileset', 'assets/gridtiles.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('ship_1', 'assets/ship_1.png');
        this.load.image('ship_2', 'assets/ship_2.png');
        this.load.image('ship_3', 'assets/ship_3.png');
        this.load.image('ship_4', 'assets/ship_4.png');
    }

    create() {
        this.map = this.make.tilemap({ key: 'map' });

        this.tiles = this.map.addTilesetImage('tiles', 'tileset');

        this.field = this.map.createStaticLayer('field', this.tiles, 0, 0);
        this.menu = this.map.createStaticLayer('menu', this.tiles, 0, 0);

        this.marker = this.add.graphics();
        this.marker.lineStyle(3, 0xffffff, 1);
        this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
        this.marker.setVisible(false)

        this.player = new Player()
    }

    update() {
        const fieldTile = this.field.getTileAtWorldXY(this.input.activePointer.x, this.input.activePointer.y)
        const menuTile = this.menu.getTileAtWorldXY(this.input.activePointer.x, this.input.activePointer.y)
        const click = this.input.activePointer.isDown

        if (fieldTile && fieldTile.properties.collide !== false) {
            const worldX = this.map.tileToWorldX(fieldTile.x)
            const worldY = this.map.tileToWorldY(fieldTile.y)

            this.marker.setPosition(worldX, worldY)
            this.marker.setVisible(true)

            if (click) {
                console.log(fieldTile.properties.sprite)
                if (!fieldTile.properties.sprite) {
                    fieldTile.properties.sprite = true

                    const sprite = this.add.tileSprite(worldX + fieldTile.width / 2, worldY + fieldTile.height / 2, TILE_WIDTH, TILE_HEIGHT, this.player.pickedShip).setInteractive()

                    sprite.on('pointerdown', function (pointer) {

                        sprite.destroy()

                    });
                }

            }
        }

        if (menuTile && menuTile.properties.ship) {
            const worldX = this.map.tileToWorldX(menuTile.x)
            const worldY = this.map.tileToWorldY(menuTile.y)

            this.marker.setPosition(worldX, worldY)
            this.marker.setVisible(true)

            if (click) {
                this.player.pickShip(menuTile.properties.ship)
            }
        }
    }
}
