import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

import CaseModal from '../Styrearbeid/CaseModal';
import MeetingModal from '../Styrearbeid/MeetingModal';

import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import Scrollable from '../Common/Scrollable'

export default class Test extends Component {
    constructor() {
        super();
        this.state = {
            
        };
    }

    componentDidMount() {
        
    }
    
    componentWillUnmount() {
        
    }

    addMemberTable() {
        let membersTableRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/tables/members`);
        let dataString = `{
            "columns": [
                {
                    "label": "Egendefinert vises",
                    "name": "custom1",
                    "options": {
                        "filter": false,
                        "sort": true
                    }
                }, {
                    "label": "Egendefinert slettet",
                    "name": "custom2",
                    "options": {
                        "filter": false,
                        "sort": true,
                        "display":"excluded"
                    }
                }
            ]
        }`;

        let data = JSON.parse(dataString);

        membersTableRef.set(data).then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    changeLanguage = lng => {
        this.props.i18n.changeLanguage(lng);
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    addEventTable() {
        let membersTableRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/tables/events`);
        let dataString = `{
            "columns": [
                {
                    "label": "Aktivitet",
                    "name": "title",
                    "options": {
                        "filter": false,
                        "sort": true
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
            ]
        }`;

        let data = JSON.parse(dataString);

        membersTableRef.set(data).then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    render() {
        return (
            <div>
                <CaseModal></CaseModal>
                <MeetingModal></MeetingModal>
                <Button color="primary" style={{marginBottom: "15px"}} onClick={this.addMemberTable.bind(this)}>Add members table def</Button>
                <Button color="primary" style={{marginBottom: "15px"}} onClick={this.addEventTable.bind(this)}>Add event table def</Button>

                <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                    <DropdownToggle>
                        Norsk
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-right-forced animated fadeInUpShort">
                        <DropdownItem onClick={() => this.changeLanguage('no')}>Norsk</DropdownItem>
                        <DropdownItem onClick={() => this.changeLanguage('en')}>English</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        );
    }
}
