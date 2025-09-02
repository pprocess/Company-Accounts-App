const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let serverProcess;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            contextIsolation: true
        }
    });

    // Load frontend from Express server
    mainWindow.loadURL("http://localhost:5000");

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

function startServer() {
    serverProcess = spawn("node", [path.join(__dirname, "backend/server.js")], {
        shell: true,
        stdio: "inherit"
    });
}

app.whenReady().then(() => {
    startServer();

    // wait 1.5s for Express to start before loading
    setTimeout(() => {
        createWindow();
    }, 1500);
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("before-quit", () => {
    if (serverProcess) serverProcess.kill();
});