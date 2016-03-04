/**
 * Created by bnelson on 3/2/16.
 */

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem;

var moment = require('moment');
var menubar = require('menubar');
var ipcMain = require('electron').ipcMain;
var path = require('path');
var cachedBounds; // cachedBounds are needed for double-clicked event

var weather = require("yahoo-weather");

var opts = {
    dir: __dirname,
    icon: path.join(__dirname, 'images', 'dark-sunny.png'),
    width: 800,
    height: 150,
    tooltip: 'Show Weather',
    transparent: "true",
    'preload-window': 'true'
};

var mb = menubar(opts);

mb.on('ready', function ready() {
    console.log('app is ready');

    var tray = mb.tray;
    var contextMenu = new Menu();
    contextMenu.append(new MenuItem({label: "Show", click: clicked}));
    //contextMenu.append(new MenuItem({label: "Update", click: util.update}));
    contextMenu.append(new MenuItem({label: "Debug", click: util.debug}));
    contextMenu.append(new MenuItem({
        label: "Quit", click: function () {
            app.quit()
        }
    }));
    tray.setContextMenu(contextMenu);
});

mb.on('after-create-window', function onCreateWindow() {
    mb.window.webContents.on('dom-ready', function () {
        //weather.find({search: 'Wentzville, MO', degreeType: 'F'}, function(err, result) {
        //    if(err) console.log(err);
        //    mb.window.webContents.send('ping', JSON.stringify(result, null, 2));
        //});
        weather({q: 'Wentzville, MO'}).then(function(result){
            //console.log(JSON.stringify(result, null, 2));
            mb.window.webContents.send('ping', JSON.stringify(result, null, 2));
        });
    });
});

function clicked(e, bounds) {
    if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return mb.hideWindow();
    if (menubar.window && menubar.window.isVisible()) return mb.hideWindow();
    cachedBounds = bounds || cachedBounds;
    mb.showWindow(cachedBounds)
}
//
var util = {
    //update: function getWeather(e, message) {
    //    if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) return mb.hideWindow();
    //    if (mb.window) return mb.hideWindow();
    //    weather.find({search: 'Wentzville, MO', degreeType: 'F'}, function (err, result) {
    //        if (err) console.log(err);
    //        console.log(JSON.stringify(result, null, 2));
    //    });
    //},

    debug: function debug() {
        mb.window.toggleDevTools();
    }
};

ipcMain.on('async-msg', function (event, arg) {
    console.log(arg);  // prints "ping"
    event.sender.send('async-reply', util.update);
});
