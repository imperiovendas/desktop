const fs = require("fs");
const path = require('path');
const https = require('https');
const AdmZip = require('adm-zip');
const { exec } = require('child_process');
const { APP } = require('./constants');
const { app } = require('electron');

let release = {
    screen:null,
    check:( screens )=>{
        release.screens = screens;

        const name = app.getName();
        const execPath = path.join( app.getPath('downloads'), name, `${name}.exe` );

        fs.existsSync( execPath ) ? release.execute( execPath, name ) : release.download();

    },

    execute:( execPath, name )=>{
        exec(execPath, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error executing program: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`Program stderr: ${stderr}`);
              return;
            }
            //console.log(`Program stdout: ${stdout}`);
   
            const delPath = path.join( app.getPath('downloads'), name );
   
            fs.rm(delPath, { recursive: true }, (err) => {
               if (err) {
                 console.error(`Error removing directory ${delPath}: ${err}`);
                 return;
               }
               console.log(`Directory ${delPath} removed successfully!`);
               app.quit();
            });
   
        });
    },

    download:()=>{
        fetch( APP.site +'/updates/desktop.json')
        .then( obj => obj.json())
        .then( obj =>{

            if( obj.version > app.getVersion() ){
                const url = `${obj.release}/app-${obj.version}.zip`;
                release.update( url, obj.version )
            }

            release.screens.sample.close();
            release.screens.main.show();

        }).catch( e => console.error( e.message ) );
    },

    update:( url, version )=>{
        const downloadPath =  `${app.getPath('downloads')}\\app-${version}`;
        const fileName = `app-${version}.zip`;
        const filePath = path.join(downloadPath, fileName);
        const fileStream = fs.createWriteStream( filePath );

        release.screens.main.webContents.send('main-response', {
            action:'downloding-release',
            msg: `Aguarde, baixando versão ${version}`
        });
        
        if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath, { recursive: true });

        const request = https.get(url, response => {
            response.pipe(fileStream);
        
            fileStream.on('finish', () => {
                release.extract( downloadPath, fileName, version );
                fileStream.close();
            });
        });

        request.on('error', err => {
            console.error('Error downloading file:', err);
        });
        
        fileStream.on('error', err => {
            console.error('Error writing to file:', err);
        });
    },

    extract:( downloadPath, fileName, version )=>{
        const zipFilePath = path.join( downloadPath, fileName);
        const extractDir = path.join( app.getPath('downloads'), app.getName());

        if (!fs.existsSync(extractDir)) fs.mkdirSync(extractDir, { recursive: true });

        const zip = new AdmZip(zipFilePath);

        try {
            
            zip.extractAllTo(extractDir, /*overwrite*/ true);
            
            release.screens.main.webContents.send('main-response', {
                action:'downloded-release',
                msg: `Versão ${version} baixada`
            });

        } catch (err) {
            console.error('Error extracting:', err);
        }

    }

}

module.exports = release;