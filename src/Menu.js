const Menu = [
    {
        heading: 'Meny',
        translate: 'sidebar.heading.HEADER'
    },
    
    {
        name: 'Uni Economy',
        icon: 'icon-note',
        translate: 'sidebar.nav.persons.ASSETS',
        submenu: [{
                name: 'Kontakter',
                path: '/kontakter',
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