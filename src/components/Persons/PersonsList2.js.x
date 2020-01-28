import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import PersonElement2 from './PersonElement2';
//import PersonBody from '../Person/Person';
//import PersonModal from './PersonModal';

import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import ScrollArea from 'react-scrollbar';

export default class PersonsTable extends Component {
    constructor() {
        super();

        this.personsRef = DB.collection(`organizations/20T/persons`);

        this.unsubscribePersons = null;
        
        this.state = {
            loadingPersons: true,
            persons: [
            ],
            dropdownPersonOpen: false,
            personStep: 0,
            personId: "",
            start: 0,
            time: 0
        };
    }

    componentDidMount() {
        this.setState({
            start: Date.now()
        });
        
        this.timer = setInterval(() => this.setState({
            time: Date.now() - this.state.start
        }), 50);
        
        if(this.props.type === "members"){
            this.unsubscribePersons = this.personsRef.where("is_member", "==", true).onSnapshot(this.onPersonsUpdate);
        } else if(this.props.type === "parents"){
            this.unsubscribePersons = this.personsRef.where("is_parent", "==", true).onSnapshot(this.onPersonsUpdate);
        } else {
            this.unsubscribePersons = this.personsRef.onSnapshot(this.onPersonsUpdate);
        }
    }
    
    componentWillUnmount() {
        this.unsubscribePersons();
    }

    onPersonsUpdate = (querySnapshot) => {
        let persons = [];
      
        querySnapshot.forEach((doc) => {
          const personObj = doc.data();
          personObj.key = doc.id;
          persons.push(personObj);
        });

        //console.log(persons);

        this.setState({ 
            persons,
            loadingPersons: false,
        });

        clearInterval(this.timer);
    }

    togglePersonsDD = () => {
        this.setState({
            dropdownPersonsOpen: !this.state.dropdownPersonsOpen
        });
    }

    displayPersons() {
        this.setState({
            personStep: 0,
            personId: ""
        });
    }

    openPerson(state, personId, event) {
        state.setState({
            personStep: 1
        });
        setTimeout(function(){
            state.setState({
                personStep: 2,
                personId: personId
            });
        }, 10);
    }

    render() {
        function persons(loading, persons, state, onClick){
            if(loading){
                return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                let personsList = persons.map((personObj, index) => {
                    return <PersonElement2 key={index} personObj={personObj} personId={personObj.key}></PersonElement2>;
                });
                return personsList;
            }
        }

        return (
            <div>
                <div className="card-header">
                    <Dropdown className="float-right" isOpen={this.state.dropdownPersonsOpen} toggle={this.togglePersonsDD}>
                        <DropdownToggle className="btn-sm">Aktive</DropdownToggle>
                        <DropdownMenu className="dropdown-menu-right-forced fadeInLeft animated">
                            <DropdownItem>Aktive</DropdownItem>
                            <DropdownItem>Arkivert</DropdownItem>
                            <DropdownItem>Alle</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <div className="card-title">{this.props.title}</div>
                </div>

                {/*<PersonModal></PersonModal>*/}

                <p>Viser {this.state.persons.length} Medlemmer</p>

                <ScrollArea
                    speed={0.8}
                    className="card-body"
                    contentClassName="content"
                    horizontal={true}
                    vertical={true}
                    style={{"height": this.props.height}}
                    >
                    <p>Lastetid = {this.state.time}</p>
                    {persons(this.state.loadingPersons, this.state.persons, this, this.openPerson)}
                </ScrollArea>
            </div>
        );

    }
}
