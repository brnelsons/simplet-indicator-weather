/**
 * Created by bnelson on 3/4/16.
 * To load and save userdata(settings) to a file
 * and maintain the settings page.
 */
const ipcRenderer = require('electron').ipcRenderer;


function loadConfig(config, callback){
    ipcRenderer.on('event-save-settings-reply', function(event, arg){
        callback(arg);
    })
}

function saveConfig(configJson){
    ipcRenderer.send('event-save-settings', configJson);
}