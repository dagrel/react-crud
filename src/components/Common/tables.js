import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';

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
];

