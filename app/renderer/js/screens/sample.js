import Layout from "../lib/layout.js";

window.addEventListener('DOMContentLoaded', ()=>{

    const layout = new Layout({
        topbar:{
            name:'sample',
            icon:'../img/app.png',
            title:'Império',
            menu:[],
            buttons:[
                {
                    icon:'minus',
                    title:'Minimizar',
                    on: (btn, app) => app.winButton.action( btn, 'sample', 'minimize')
                },
                {
                    icon:'maximize',
                    title:'Maximizar',
                    on: (btn, app) => app.winButton.action( btn, 'sample', 'toggle')
                },
                {
                    icon:'x',
                    title:'Fechar',
                    on: (btn, app) => app.winButton.action( btn, 'sample', 'close')
                }
            ]
        },
        views:true,
        toolbar:true
    });

    layout.init();
    
});