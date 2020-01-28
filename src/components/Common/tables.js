import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';

export const membersColumns = [
    {
        "label": "ID",
        "name": "key",
        "options": {
            "filter": false,
            "sort": false,
            "display": "excluded"
        }
    },
    {
        "label": "Etternavn",
        "name": "last_name",
        "options": {
            "filter": false,
            "sort": true,
            customBodyRender: (value, tableMeta, updateValue) => ( // bruk dette i tittel kolonna
                <Link to={`/person/${tableMeta.rowData[0]}`}>
                    {value}
                </Link>
            )
        }
    },
    {
        "label": "Fornavn",
        "name": "first_name",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Avdeling",
        "name": "department_name",
        "options": {
            "filter": true,
            "sort": true
        }
    },
    {
        "label": "Gruppe",
        "name": "group_name",
        "options": {
            "filter": true,
            "sort": true
        }
    },
    {
        "label": "Mobil",
        "name": "mobile",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Epost",
        "name": "email_1",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Epost 2",
        "name": "email_2",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Telefon",
        "name": "phone",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Adresse",
        "name": "address_1",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Adresse 2",
        "name": "address_2",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "By",
        "name": "city",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Postkode",
        "name": "postcode",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Foresatte",
        "name": "parents",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Barn",
        "name": "children",
        "options": {
            "filter": false,
            "sort": true
        }
    }, {
        "label": "Status",
        "name": "status",
        "options": {
            "filter": true,
            "sort": true,
            customBodyRender: (value, tableMeta, updateValue) => (
                <div className="badge badge-success">{value}</div>
            )
        }
    }
];

export const parentsColumns = [
    {
        "label": "ID",
        "name": "key",
        "options": {
            "filter": false,
            "sort": false,
            "display": "excluded"
        }
    },
    {
        "label": "Etternavn",
        "name": "last_name",
        "options": {
            "filter": false,
            "sort": true,
            customBodyRender: (value, tableMeta, updateValue) => (
                <Link to={`/person/${tableMeta.rowData[0]}`}>
                    {value}
                </Link>
            )
        }
    },
    {
        "label": "Fornavn",
        "name": "first_name",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Mobil",
        "name": "mobile",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Epost",
        "name": "email_1",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Epost 2",
        "name": "email_2",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Telefon",
        "name": "phone",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Adresse",
        "name": "address_1",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Adresse 2",
        "name": "address_2",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "By",
        "name": "city",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Postkode",
        "name": "postcode",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Barn",
        "name": "children",
        "options": {
            "filter": false,
            "sort": true
        }
    }
];

export const personsColumns = [
    {
        "label": "ID",
        "name": "key",
        "options": {
            "filter": false,
            "sort": false,
            "display": "excluded"
        }
    },
    {
        "label": "Etternavn",
        "name": "last_name",
        "options": {
            "filter": false,
            "sort": true,
            customBodyRender: (value, tableMeta, updateValue) => (
                <Link to={`/person/${tableMeta.rowData[0]}`}>
                    {value}
                </Link>
            )
        }
    },
    {
        "label": "Fornavn",
        "name": "first_name",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Mobil",
        "name": "mobile",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Epost",
        "name": "email_1",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Epost 2",
        "name": "email_2",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Telefon",
        "name": "phone",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Adresse",
        "name": "address_1",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Adresse 2",
        "name": "address_2",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "By",
        "name": "city",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Postkode",
        "name": "postcode",
        "options": {
            "filter": false,
            "sort": true
        }
    }
];

export const eventsColumns = [
    {
        "label": "ID",
        "name": "key",
        "options": {
            "filter": false,
            "sort": false,
            "display": "excluded"
        }
    },
    {
        "label": "Aktivitet",
        "name": "title",
        "options": {
            "filter": false,
            "sort": true,
            customBodyRender: (value, tableMeta, updateValue) => (
                <Link to={`/aktivitet/${tableMeta.rowData[0]}`}>
                    {value}
                </Link>
            )
        }
    },
    {
        "label": "Tid",
        "name": "start_time",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Sted",
        "name": "place",
        "options": {
            "filter": true,
            "sort": true
        }
    },
    {
        "label": "Adresse",
        "name": "address",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Internkommentar",
        "name": "comment_internal",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Kommentar",
        "name": "comment_public",
        "options": {
            "filter": false,
            "sort": true
        }
    }
];

export const serviceColumn = [
    {
        "label": "ID",
        "name": "key",
        "options": {
            "filter": false,
            "sort": false,
            "display": "excluded"
        }
    },
    /*{
        "label": "Dato utlevert",
        "name": "delivered",
        "options": {
            "filter": false,
            "sort": true,
            customBodyRender: (value, tableMeta, updateValue) => ( // funksjon for å redirecte til ny fil
                <Link to={`detaljer/${tableMeta.rowData[0]}`}>
                    {value}
                </Link>
            )
        }
    },*/

    {
    "label": "Opprettet av",
    "name": "createdBy",
    "options": {
        "filter": false,
        "sort": true,
    }
}
];

export const typeColumn = [
    {
        "label": "type_one"
    }
]

export const assetsColumn = [
    {
        "label": "ID",
        "name": "key",
        "options": {
            "filter": false,
            "sort": false,
            "display": "excluded"
        }
    },
    
    {
        "label": "Tittel",
        "name": "title",
        "options": {
            "filter": false,
            "sort": true,
            customBodyRender: (value, tableMeta, updateValue) => ( // funksjon for å redirecte til ny fil
                <Link to={`detaljer/${tableMeta.rowData[0]}`}>
                    {value}
                </Link>
            )
        }
    },
    {
        "label": "Merke",
        "name": "brand",
        "options": {
            "filter": true,
            "sort": true
        }
    },
    {
        "label": "Serienummer",
        "name": "serialnumber",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Beskrivelse",
        "name": "description_long",
        "options": {
            "filter": false,
            "sort": false,
            "display": "excluded"
        }
    },
    {
        "label": "Teknisk beskrivelse",
        "name": "description_technical",
        "options": {
            "filter": false,
            "sort": false,
            "display": "excluded"
        }
    },
    {
        "label": "Dato kondemnert",
        "name": "date_scrapped",
        "options": {
            "filter": false,
            "sort": true,
           "display": "excluded"
        }
    },
    {
        "label": "Dato kjøpt",
        "name": "date_bought",
        "options": {
            "filter": false,
            "sort": true,
        }
    }, 
    {
        "label": "Type",
        "name": "type_label",
        "options": {
            "filter": true,
            "sort": true,
        }
    },
    {
        "label": "Variant",
        "name": "variant_label",
        "options": {
            "filter": true,
            "sort": true,
        }
    },
    {
        "label": "Verdi",
        "name": "current_value",
        "options": {
            "filter": true,
            "sort": true,
        }
    },
    {
        "label": "Original pris",
        "name": "original_price",
        "options": {
            "filter": true,
            "sort": true,
        }
    }
];

export const attendanceColumns = [
    {
        "label": "ID",
        "name": "key",
        "options": {
            "filter": false,
            "sort": false,
            "display": "excluded"
        }
    },
    {
        "label": "Etternavn",
        "name": "last_name",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Fornavn",
        "name": "first_name",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Status",
        "name": "status",
        "options": {
            "filter": false,
            "sort": true
        }
    }
];