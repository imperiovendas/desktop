

class Layout{

    constructor( obj = {} ){
        this.obj = obj;
        this.el = null;
        this.views = {};
        this.pages = [];
        this.header = this._header();
        this.section = null;
        this.footer = this._footer();
        this.memories = JSON.parse( localStorage.getItem('Imperio') ) || {};
        this.api = this._api();

       // localStorage.setItem('Imperio', JSON.stringify({user:{level:2}})) 

        //Public Methods
        this.app = {
            navigator:this._navigator(),
            winButton:this._winButton(),
            notify: this.footer.notify
        }
    }

    _header(){
        return {
            obj:{},
            init:( obj, el ) => {
                this.header.obj = obj;
                
                for(const k in obj ){
                    if( this.header[k] ) el.append( this.header[k].init() );
                }

            },

            icon:{
                init:()=>{
                    const figure = document.createElement('figure');
                    const img = document.createElement('img');
                    img.src = this.header.obj.icon;
                    figure.append( img );
                    return figure;
                }
            },
            title:{
                init:()=>{
                    const h1 = document.createElement('h1');
                    h1.textContent = this.header.obj.title;
                    return h1;
                }
            },
            menu:{
                init:()=>{
                    const nav = document.createElement('nav');
                    const ul = document.createElement('ul');
                    ul.className = 'menu';


                    this.header.obj.menu.forEach( obj =>{

                        const userLevel = !this.memories.user ? 0 : this.memories.user.level;

                        const { level, text, submenu, on } = obj;

                        if( level && !level.includes( userLevel ) ) return;

                        if( text ){
                            const li = document.createElement('li');
                            const a = document.createElement('a');
                            a.textContent = text;

                            if( on ) a.addEventListener('click', ()=> on( this.app ), false);

                            li.append( a );
                            if( submenu ) this.header.menu.submenu( li, submenu );
                            
                            ul.append( li );
                        }

                    });

                    ul.addEventListener('click', () =>{
                        [...ul.querySelectorAll('li')].forEach( _li =>{

                            if( _li.querySelector('.submenu') ){

                                const sub = _li.classList.contains('on-sub');

                                sub ? _li.classList.remove('on-sub') : _li.classList.add('on-sub')

                            }
                    
                        }, false);
                    }, false);
                    
                    nav.append( ul );
                    return nav;
                },

                submenu:( menu, submenu )=>{
                    const ul = document.createElement('ul');
                    ul.className = 'submenu';

                    const userLevel = !this.memories.user ? 0 : this.memories.user.level;

                    submenu.forEach( obj =>{
                        const { text, tip, icon, line, level, on } = obj;

                        if( level && !level.includes( userLevel ) ) return;

                        const li = document.createElement('li');
                        if( !line ){

                            const a = document.createElement('a');

                            if( on ) a.addEventListener('click', ()=> on( this.app ), false);

                            a.innerHTML = `<p>${text}</p>`;
    
                            if( tip ) a.innerHTML += `<small>${tip}</small>`;
                            if( icon ) a.innerHTML += `<i class="icon icon-${icon}"></i>`;
                            
                            li.append( a );
                            
                        }else{
                            li.classList.add('line')
                        }

                        ul.append( li );
                    });

                    menu.append( ul );

                }
            },
            buttons:{
                init:()=>{
                    const aside = document.createElement('aside');
                    
                    this.header.obj.buttons.forEach( obj =>{

                        const { icon, title, on } = obj;

                        const a = document.createElement('a');
                        a.classList.add('icon', `icon-${icon}`);

                        if( title ) a.title = title;

                        if( on ) a.addEventListener('click', ()=> on(a, this.app), false);

                        aside.append( a );

                    });

                    return aside;
                }
            }
        }
    }

    _footer(){
        return {
            footer:null,
            init:( el ) => {
                this.footer.el = el;

                ['span','p'].forEach( tag =>{
                    const tags = document.createElement( tag );
                    this.footer.el.append( tags );
                });

            },

            notify:( obj = {} )=>{
                const { icon, spin, color, bgcolor, text } = obj;
                const span = this.footer.el.querySelector('span');
                const p = this.footer.el.querySelector('p');
                const i = document.createElement('i');
                
                ['red','green','blue'].forEach( c => span.classList.remove(`bg-${c}`) );

                span.innerHTML = '';
                p.innerHTML = '';

                if( icon ){
                    i.classList.add('icon', `icon-${icon}`);

                    if( color ) i.classList.add(`color-${color}`);
                    if( bgcolor ) span.classList.add(`bg-${bgcolor}`);

                    if( spin ) i.classList.add('spinning');
                    span.append( i );
                }

                if( text ) p.textContent = text

            }
        }
    }

    _navigator(){
        return{
            navigate:( obj = {} )=>{
                const { name } = obj;

                if( this.views[name] ){
                    const div = document.createElement('div');
                    div.setAttribute('data-view', name);

                    this.pages = [ name ];
                    this.section.innerHTML = '';

                    this.section.append( div );

                    this.app.view = div;

                    this.views[name].init( this.app );
                }

            },

            pushView:( obj = {} )=>{

                const { name, title } = obj;

                this.pages = this.pages.filter( p => p != name );
                this.pages.push( name );

                let page = document.querySelector(`[data-view="${name}"]`);
                if( page ) page.remove();

                page = document.createElement('div');
                page.setAttribute('data-view', name);
                page.className = 'push-view';

                const header = document.createElement('header');
                const i = document.createElement('i');

                header.className = 'view-header';
                i.classList.add('icon', 'icon-arrow-left');
                i.title = 'Voltar';

                i.addEventListener('click', ()=> this.app.navigator.popView(), false);
                header.append( i );

                if( title ){
                    const h3 = document.createElement('h3');
                    h3.textContent =  title;
                    header.append( h3 );
                }

                
                page.append( header );

                this.section.append( page );
                this.app.view = page;
                this.views[name].init( this.app );
            },

            popView:()=>{

                const rm = this.pages.pop();
                const page = document.querySelector(`[data-view="${rm}"]`);

                if( page ){
                    page.classList.remove('push-view');
                    page.classList.add('pop-view');

                    setTimeout(()=> page.remove(), 400);
                }
            }

        }
    }

    _winButton(){
        return {
            action:( btn, win, action )=>{
                window.electronAPI.send('win-button', { win, action });

                window.electronAPI.on('win-button-icon', icon =>{

                    btn.classList.remove('icon-maximize', 'icon-minimize');
                    btn.classList.add(`icon-${icon}`);
                    
                });
            }
        }
    }

    _api(){
        return {
            request:( data )=>{
                window.electronAPI.send(`${this.obj.name}-request`, data );
            },
            response:()=>{
                window.electronAPI.on(`${this.obj.name}-response`, resp => {

                    switch ( resp.action ) {
                        case 'downloding-release':
                            this.api.downloadingVersion( resp.msg );
                            break;
                        case 'downloded-release':
                            this.api.downloadedVersion( resp.msg );
                            break;                            
                    
                    }

                });
            },
            downloadingVersion:( text )=>{
                this.app.notify( {icon:'loader', bgcolor:'blue', spin:true, text } );
            },
            downloadedVersion:( text )=>{
                this.app.notify( {icon:'download-cloud', text } );
            }            
        }
    }

    build( cb ){
        const appends = [];
        const { topbar, views, toolbar } = this.obj;

        this.el = document.createElement('main');
        this.el.id = 'app';

        const section = document.createElement('section');
        section.id = 'views';
        this.section = section;

        if( topbar ){
            const header = document.createElement('header');
            header.id = 'topbar';
            this.header.init( topbar, header );

            appends.push( header );
        }

        if( views ) this.views = views;

        appends.push( section );

        if( toolbar ){
            const footer = document.createElement('footer');
            footer.id = 'toolbar';
            this.footer.init( footer );

            appends.push( footer );
        }

        appends.forEach( element => this.el.append( element ) );

        document.body.prepend( this.el );
        cb();
    }

    auth(){

        const user = this.memories.user;

        if( !user ) return this.app.navigator.navigate({name:'login'});
        
    }

    init(){
        this.build(()=>{
            this.api.response();
            this.auth();
        });
    }
}

export default Layout;