const Menu = [
    {
        heading: 'Meny',
        translate: 'sidebar.heading.HEADER'
    },
    
    {
        name: 'TEST1111',
        icon: 'icon-note',
        translate: 'sidebar.nav.persons.ASSETS',
        submenu: [{
                name: 'Kontakter',
                path: '/instrumenter',
            }
        ]
    },
    {
        name: 'Test',
        icon: 'icon-note',
        submenu: [{
                name: 'Kontakter',
                path: '/kontakter',
            }
        ]
    }
];

export default Menu;