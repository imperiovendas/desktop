const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const release = require('./releases');
const { APP } = require('./constants');

class Screen{

    constructor(){
        this.htmls = path.join(__dirname,'..','renderer','html');
        this.screens = {};
    }

    //window events
    winButtons(){
        ipcMain.on('win-button', ( ev, obj ) =>{
            const { win, action } = obj;

            if( !this.screens[win] ) return;

            if( action == 'quit' ) return app.quit();
            if( action == 'minimize' ) return this.screens[win].minimize();
            if( action == 'close' ) return this.screens[win].close();

            
            if(action == 'toggle' ){
                let icon = 'maximize';

                if( this.screens[win].isMaximized() ){

                    this.screens[win].restore();
                    
                }else{

                    this.screens[win].maximize();
                    icon = 'minimize';
                }

                ev.sender.send('win-button-icon', icon);
            }

        });
    }

    /* This is the main window */
    main(){

       if( !this.screens.main ) this.screens.main =  new BrowserWindow({
        frame:false,
        show:false,
        width:800,
        height:600,
        icon: path.join(__dirname,'..','renderer','img','app-48.png'),
        webPreferences: {
            contextIsolation:true,
            nodeIntegration:true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

        this.screens.main.once('ready-to-show', () => {

            this.winButtons();

            this.screens.main.show();

            //this.sample();

            //setTimeout(() =>  release.check( this.screens ) , 5000);
        
        });

        this.screens.main.on('closed', () => {
            this.screens.main = {};
            app.quit();
        });

        this.screens.main.setTitle( APP.name +' '+ app.getVersion() );
        this.screens.main.loadFile( this.htmls + '/main.html');
    }

    sample(){

        if( this.screens.sample ) return;
    
        this.screens.sample =  new BrowserWindow({
            frame:false,
            show:false,
            width:500,
            height:420,
            icon: path.join(__dirname,'..','renderer','img','app-48.png'),
            webPreferences: {
                contextIsolation:true,
                nodeIntegration:true,
                preload: path.join(__dirname, 'preload.js')
            }
        });

        this.screens.sample.once('ready-to-show', () => {
            this.screens.sample.show();
        
        });

        this.screens.sample.on('closed', () => {
            delete this.screens.sample;
        });

        this.screens.sample.setTitle( 'Sample Win' );
        this.screens.sample.loadFile( this.htmls + '/sample.html');
    }
}

const screen = new Screen;
module.exports = screen