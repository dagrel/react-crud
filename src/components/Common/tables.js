import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';



/*export const contactsColumn = [
    {
        "label": "ID",
        "name": "key",
        "options": {
            "filter": false,
            "sort": false,
            customBodyRender: (value, tableMeta, updateValue) => (
                <Link to={`/kontaktdetaljer/${tableMeta.rowData[0]}`}>
                    {value}
                </Link>
            )
        }
    },
    {
        "label": "Info ID",
        "name": "ParentBusinessRelationID",
        "options": {
            "filter": false,
            "sort": true,
        }
    },
    {
        "label": "Selskapsrelasjon",
        "name": "InfoID",
        "options": {
            "filter": false,
            "sort": true,
        }
    },
    
];
*/


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
        "label": "ID",
        "name": "ID",
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
        "label": "Info ID",
        "name": "InfoID",
        "options": {
            "filter": false,
            "sort": true,
        }
    },
    {
        "label": "Selskapsrelasjon",
        "name": "ParentBusinessRelationID",
        "options": {
            "filter": true,
            "sort": true
        }
    },
    {
        "label": "Rolle",
        "name": "Role",
        "options": {
            "filter": true,
            "sort": true
        }
    },
    {
        "label": "Dato opprettet",
        "name": "created",
        "options": {
            "filter": false,
            "sort": true
        }
    },
    {
        "label": "Opprettet av",
        "name": "CreatedBy",
        "options": {
            "filter": false,
            "sort": true
        }
    },

    /*{
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
    }*/
];

