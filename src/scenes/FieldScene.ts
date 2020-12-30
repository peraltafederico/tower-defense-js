import Phaser from 'phaser'

export default class HelloWorldScene extends Phaser.Scene {
    map: Phaser.Tilemaps.Tilemap
    tiles: Phaser.Tilemaps.Tileset
    marker: Phaser.GameObjects.Graphics
    field: Phaser.Tilemaps.StaticTilemapLayer
    menu: Phaser.Tilemaps.StaticTilemapLayer

    constructor() {
        super('hello-world')
    }

    preload() {
        this.load.image('tileset', 'assets/gridtiles.png');
        this.load.tilemapTiledJSON('map', 'assets/map.json');
        this.load.image('ship_4', 'assets/ship_4.png');
    }

    create() {
        this.map = this.make.tilemap({ key: 'map' });

        this.tiles = this.map.addTilesetImage('tiles', 'tileset');

        const a = this.map.getObjectLayer('gun_1');

        console.log(a)

        this.field = this.map.createStaticLayer('field', this.tiles, 0, 0);
        this.menu = this.map.createStaticLayer('menu', this.tiles, 0, 0);

        this.marker = this.add.graphics();
        this.marker.lineStyle(3, 0xffffff, 1);
        this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
        this.marker.setVisible(false)
    }

    update() {
        const fieldTile = this.field.getTileAtWorldXY(this.input.activePointer.x, this.input.activePointer.y)
        const menuTile = this.menu.getTileAtWorldXY(this.input.activePointer.x, this.input.activePointer.y)

        if (fieldTile && fieldTile.properties.collide !== false) {
            if (this.input.activePointer.isDown) {
                this.add.tileSprite(this.map.tileToWorldX(fieldTile.x) + fieldTile.width / 2, this.map.tileToWorldY(fieldTile.y) + fieldTile.height / 2, 32, 32, 'ship_4')
            }

            this.marker.setPosition(this.map.tileToWorldX(fieldTile.x), this.map.tileToWorldX(fieldTile.y))
            this.marker.setVisible(true)
        }

        if (menuTile) {
            this.marker.setPosition(this.map.tileToWorldX(menuTile.x), this.map.tileToWorldY(menuTile.y))
            this.marker.setVisible(true)
        }
    }
}
