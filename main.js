const {app, BrowserWindow} = require('electron')
  const path = require('path')
  const url = require('url')
  
  // Keep a global reference of the window object, if you don't, the window will
  // be closed automatically when the JavaScript object is garbage collected.
  let win
  
  function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({width: 800, height: 600})
  
    // and load the index.html of the app.
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

 win.webContents.openDevTools()  
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      win = null
    })
  }
  
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow)
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })
  
  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
var osc = require("osc"),
    WebSocket = require("ws")


var getIPAddresses = function () {
    var os = require("os"),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

    for (var deviceName in interfaces){
        var addresses = interfaces[deviceName];

        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];

            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

var udp = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 7400,
    remoteAddress: "127.0.0.1",
    remotePort: 7500
});

udp.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udp.options.localPort);
    });
    console.log("Broadcasting OSC over UDP to", udp.options.remoteAddress + ", Port:", udp.options.remotePort);
});

udp.open();

var wss = new WebSocket.Server({
    port: 8081
});

wss.on("connection", function (socket) {
    console.log("A Web Socket connection has been established!");
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    var relay = new osc.Relay(udp, socketPort, {
        raw: true
    });
});

