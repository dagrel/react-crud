import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
//import PersonElement2 from './PersonElement2';
import MUIDataTable from "mui-datatables";
//import PersonBody from '../Person/Person';
//import PersonModal from './PersonModal';
import { Router, Route, Link } from 'react-router-dom';
import { findObjectIndex } from '../Common/tools';
import { DB, OrgKey, UidKey } from '../Common/firebase';
import { membersColumns, parentsColumns, personsColumns } from '../Common/tables';

import 'loaders.css/loaders.css';

import ScrollArea from 'react-scrollbar';

export default class PersonsTable extends Component {
    constructor() {
        super();

        this.personsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/persons`);

        this.unsubscribePersons = null;

        this.state = {
            loadingPersons: true,
            persons: [
            ],
            dropdownPersonOpen: false,
            personStep: 0,
            personId: ""
        };
    }

    componentDidMount() {
        let tState = this;
        
        if(this.props.type === "members"){
            this.unsubscribePersons = this.personsRef.where("is_member", "==", true).onSnapshot(this.onPersonsUpdate);
            if(window.localStorage.getItem("members") !== null){
                this.tableData = JSON.parse(window.localStorage.getItem("members"));
            } else {
                this.tableData = {
                    columns:[]
                }
            }
            this.userOrgTableData = JSON.parse(window.localStorage.getItem("members_columns"));
            this.tableData.columns = membersColumns.concat(this.tableData.columns);
        } else if(this.props.type === "parents"){
            this.unsubscribePersons = this.personsRef.where("is_parent", "==", true).onSnapshot(this.onPersonsUpdate);
            if(window.localStorage.getItem("parents") !== null){
                this.tableData = JSON.parse(window.localStorage.getItem("parents"));
            } else {
                this.tableData = {
                    columns:[]
                }
            }
            this.userOrgTableData = JSON.parse(window.localStorage.getItem("parents_columns"));
            this.tableData.columns = parentsColumns.concat(this.tableData.columns);
        } else {
            this.unsubscribePersons = this.personsRef.onSnapshot(this.onPersonsUpdate);
            if(window.localStorage.getItem("persons") !== null){
                this.tableData = JSON.parse(window.localStorage.getItem("persons"));
            } else {
                this.tableData = {
                    columns:[]
                }
            }
            this.userOrgTableData = JSON.parse(window.localStorage.getItem("persons_columns"));
            this.tableData.columns = personsColumns.concat(this.tableData.columns);
        }
        
        if(this.userOrgTableData){
            this.userOrgTableData.hidden_columns.forEach(function(indexToHide){
                tState.tableData.columns[indexToHide].options.display = false;
            });
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

    columnViewChanged(changedColumn, action) {
        let tableType = this.props.type;
        let userOrgTableObj = JSON.parse(window.localStorage.getItem(`${tableType}_columns`));
        let changedColumnIndex = findObjectIndex(this.tableData.columns, "name", changedColumn);

        if(action === "add"){
            var changedIndex = userOrgTableObj.hidden_columns.indexOf(changedColumnIndex);
            if (changedIndex > -1) {
                userOrgTableObj.hidden_columns.splice(changedIndex, 1);
            }
        } else if(action === "remove"){
            userOrgTableObj.hidden_columns.push(changedColumnIndex);
        }

        window.localStorage.setItem(`${tableType}_columns`, JSON.stringify(userOrgTableObj));

        var userOrgTableRef = DB.doc(`users/${window.localStorage.getItem(UidKey)}/styreportalen/${window.localStorage.getItem(OrgKey)}/tables/${tableType}`);

        userOrgTableRef.set(userOrgTableObj).then(ref => {
            
        });
        /*
        var userOrgTableRef = DB.doc(`users/${window.localStorage.getItem(UidKey)}/styreportalen/${window.localStorage.getItem(OrgKey)}/tables/${tableType}`);

        userOrgTableRef.get().then(function(userOrgTable) {
            if (userOrgTable.exists) {
                var userOrgTableObj = userOrgTable.data();
            } else {
                var userOrgTableObj = {
                    hidden_columns: []
                };
            }
            
            if(action === "add"){
                var changedIndex = userOrgTableObj.hidden_columns.indexOf(changedColumnIndex);
                if (changedIndex > -1) {
                    userOrgTableObj.hidden_columns.splice(changedIndex, 1);
                }
            } else if(action === "remove"){
                userOrgTableObj.hidden_columns.push(changedColumnIndex);
            }

            userOrgTableRef.set(userOrgTableObj).then(ref => {
                window.localStorage.setItem(tableType+"_columns", JSON.stringify(userOrgTableObj));
            });
        });
        */
    }

    render() {
        const options = {
            filterType: 'multiselect',
            pagination: true,
            selectableRows: false,
            textLabels: {
                body: {
                  noMatch: "Fant ingen matchende elementer",
                  toolTip: "Sorter",
                },
                pagination: {
                  next: "Neste Side",
                  previous: "Forrige Side",
                  rowsPerPage: "Rader per side:",
                  displayRows: "av",
                },
                toolbar: {
                  search: "Søk",
                  downloadCsv: "Last ned CSV",
                  print: "Print",
                  viewColumns: "Vis Kolonner",
                  filterTable: "Filtrer Tabell",
                },
                filter: {
                  all: "Alle",
                  title: "FILTERE",
                  reset: "GJENNOPPRETT",
                },
                viewColumns: {
                  title: "Vis Kolonner",
                  titleAria: "Vis/Skjul Tabell Kolonner",
                },
                selectedRows: {
                  text: "rad(er) valgt",
                  delete: "Slett",
                  deleteAria: "Slett Valgte Rader",
                },
            },
            onColumnViewChange: (changedColumn, action) => (
                this.columnViewChanged(changedColumn, action)
            )
        };
        /*
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
        */

        if(this.state.loadingPersons){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
        }

        return (
            <MUIDataTable
                title={this.props.title}
                data={this.state.persons}
                columns={this.tableData.columns}
                options={options}
            />
        );

    }
}
