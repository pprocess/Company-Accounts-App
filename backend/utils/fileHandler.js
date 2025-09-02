const fs = require("fs");

function loadData(file) {
    try {
        const data = fs.readFileSync(file);
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

module.exports = { loadData, saveData };