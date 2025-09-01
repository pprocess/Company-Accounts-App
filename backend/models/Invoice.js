const { v4: uuidv4 } = require("uuid");

class Invoice {
    constructor(customerId, items) {
        this.id = uuidv4().slice(0, 8);
        this.date = new Date().toISOString();
        this.customerId = customerId;
        this.items = items; // [{ productId, name, quantity, price, subtotal }]
        this.total = items.reduce((sum, i) => sum + i.subtotal, 0);
    }

    toJSON() {
        return {
            id: this.id,
            date: this.date,
            customerId: this.customerId,
            items: this.items,
            total: this.total
        };
    }
}

module.exports = Invoice;