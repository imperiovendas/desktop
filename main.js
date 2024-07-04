if(require('electron-squirrel-startup')) return;

const { app } = require('electron');
const screen = require('./app/main/screens');
const release = require('./app/main/releases');

app.whenReady().then(() => {

   screen.main();

});

app.on('window-all-closed', () => app.quit() );

