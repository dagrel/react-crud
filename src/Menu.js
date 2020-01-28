const Menu = [
    {
        heading: 'Meny',
        translate: 'sidebar.heading.HEADER'
    },
    
    {
        name: 'Eiendeler',
        icon: 'icon-note',
        translate: 'sidebar.nav.persons.ASSETS',
        submenu: [{
                name: 'Instrumenter',
                path: '/instrumenter',
                translate: 'sidebar.nav.persons.INSTRUMENTS'
            }
        ]
    },
    {
        name: 'Uni',
        icon: 'icon-note',
        submenu: [{
                name: 'Kontakter',
                path: '/kontakter',
                translate: 'sidebar.nav.persons.INSTRUMENTS'
            }
        ]
    },
];

export default Menu;