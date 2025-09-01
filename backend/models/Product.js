const { v4: uuidv4 } = require("uuid");

class Product {
    constructor(name, price, quantity) {
        this.id = uuidv4().slice(0, 8);
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            quantity: this.quantity
        };
    }

    update(details) {
        if (details.name) this.name = details.name;
        if (details.price !== undefined) this.price = details.price;
        if (details.quantity !== undefined) this.quantity = details.quantity;
    }
}

module.exports = Product;