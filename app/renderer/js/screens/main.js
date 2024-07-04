import Layout from "../lib/layout.js";
import pages from "../views/pages.js";

window.addEventListener('DOMContentLoaded', ()=>{

    const layout = new Layout({
        name:'main',
        topbar:{
            icon:'../img/app.png',
            //title:'Império',
            menu:[
                {
                    level:[0, 1, 2],
                    text:'Império',
                    submenu:[
                        {
                            level:[0],
                            icon:'log-in',
                            text:'Acessar',
                            on: app => app.navigator.navigate({name:'login'})
                        },
                        {
                            level:[1, 2],
                            icon:'log-out',
                            text:'Sair',
                        }
                    ]
                }
            ],
            buttons:[
                {
                    icon:'minus',
                    title:'Minimizar',
                    on: (btn, app) => app.winButton.action( btn, 'main', 'minimize')
                },
                {
                    icon:'maximize',
                    title:'Maximizar',
                    on: (btn, app) => app.winButton.action( btn, 'main', 'toggle')
                },
                {
                    icon:'x',
                    title:'Fechar',
                    on: (btn, app) => app.winButton.action( btn, 'main', 'quit')
                }
            ]
        },
        views:pages,// here comes the views
        toolbar:true
    });

    layout.init();
    
});