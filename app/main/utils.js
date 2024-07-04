const { app } = require('electron');

function getAppDataPath(){
    const roaming = 'Roaming';
    let appdataList = app.getPath('appData').split('\\');
 
    appdataList.push( 'Local', app.getName() );
 
    if( appdataList.includes( roaming ) ){
       appdataList = appdataList.filter( x => x != roaming );
    }
 
    return appdataList.join('\\');
}

module.exports = {
    getAppDataPath
}