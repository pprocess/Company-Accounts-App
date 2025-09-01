class Audit {
    constructor() {
        this.logs = [];
    }

    log(eventType, message) {
        const entry = {
            timestamp: new Date().toISOString(),
            eventType,
            message
        };
        this.logs.push(entry);
        return entry;
    }
}

module.exports = new Audit();