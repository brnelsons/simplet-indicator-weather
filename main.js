/**
 * Created by bnelson on 3/2/16.
 */

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;
const BrowserWindow = electron.BrowserWindow;

var DEBUG_ENABLED = true;

var moment = require('moment');
var menubar = require('menubar');
var ipcMain = require('electron').ipcMain;
var path = require('path');
var weather = require("yahoo-weather");
var cachedBounds; // cachedBounds are needed for double-clicked event

var opts = {
    dir: __dirname,
    icon: path.join(__dirname, 'images', 'light-sunny.png'),
    width: 800,
    height: 150,
    tooltip: 'Show Weather',
    transparent: "true",
    'preload-window': 'true',
    'always-on-top': 'true'
};

var mb = menubar(opts);

mb.on('ready', function ready() {
    console.log('app is ready');

    var tray = mb.tray;
    var contextMenu = new Menu();
    contextMenu.append(new MenuItem({label: "Show", click: clicked}));
    contextMenu.append(new MenuItem({label: "Settings", click: util.showSettings}));
    if (DEBUG_ENABLED) {
        contextMenu.append(new MenuItem({label: "Debug", click: util.debug}));
    }
    contextMenu.append(new MenuItem({
        label: "Quit", click: function () {
            app.quit()
        }
    }));
    tray.setContextMenu(contextMenu);
});

mb.on('after-create-window', function onCreateWindow() {
    mb.window.webContents.on('dom-ready', function () {
        weather({q: 'Wentzville, MO'}).then(function (result) {
            mb.window.webContents.send('ping', JSON.stringify(result, null, 2));
        });
    });
});

function clicked(e, bounds) {
    if (DEBUG_ENABLED) {
        //disable auto hide functions
        if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return mb.hideWindow();
        if (menubar.window && menubar.window.isVisible()) return mb.hideWindow();
    }
    cachedBounds = bounds || cachedBounds;
    mb.showWindow(cachedBounds)
}
//
var util = {
    showSettings: function settings() {
        var options = {
            height:200,
            width:400,
            show: true,
            frame: true,
            center: true,
            darkTheme: true
        };
        var newWindow = new BrowserWindow(options);
        newWindow.loadURL('file://' + path.join(opts.dir, 'settings.html'))
    },

    debug: function debug() {
        mb.window.toggleDevTools();
    }
};

ipcMain.on('async-msg', function (event, arg) {
    console.log(arg);  // prints "ping"
    event.sender.send('async-reply', util.update);
});
