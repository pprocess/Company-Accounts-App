const { v4: uuidv4 } = require("uuid");

class Customer {
    constructor(name, email) {
        this.id = uuidv4().slice(0, 8);
        this.name = name;
        this.email = email;
        this.products = []; // { productId, profitMargin }
    }

    addProduct(productId, profitMargin) {
        this.products.push({ productId, profitMargin });
    }

    update(details) {
        if (details.name) this.name = details.name;
        if (details.email) this.email = details.email;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            products: this.products
        };
    }
}

module.exports = Customer;