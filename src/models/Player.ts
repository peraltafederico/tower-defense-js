import { SHIPS } from "../config/constants";

export default class Player {
    pickedShip: SHIPS

    constructor() { }

    pickShip(ship: SHIPS) {
        this.pickedShip = ship
    }

}