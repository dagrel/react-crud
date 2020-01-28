import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
//import PersonElement2 from './PersonElement2';
import MUIDataTable from "mui-datatables";
//import PersonBody from '../Person/Person';
//import PersonModal from './PersonModal';
import { eventsColumns } from '../Common/tables';

import { DB, OrgKey, CalKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import ScrollArea from 'react-scrollbar';
import * as moment from 'moment';

export default class EventsTable extends Component {
    constructor() {
        super();

        this.eventsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/events`);

        this.unsubscribeEvents = null;

        this.tableData = JSON.parse(window.localStorage.getItem("events"));
        this.calendars = window.localStorage.getItem(CalKey).split(",");
        
        this.state = {
            loadingEvents: true,
            events: [
            ],
            dropdownEventsOpen: false
        };
    }

    componentDidMount() {
      this.unsubscribeEvents = this.eventsRef.onSnapshot(this.onEventsUpdate);
      if(window.localStorage.getItem("events") !== null){
        this.tableData = JSON.parse(window.localStorage.getItem("events"));
      } else {
        this.tableData = {
            columns:[]
        }
      }

      this.userOrgTableData = JSON.parse(window.localStorage.getItem("events_columns"));
      this.tableData.columns = eventsColumns.concat(this.tableData.columns);

      if(this.userOrgTableData){
        this.userOrgTableData.hidden_columns.forEach(function(indexToHide){
          this.tableData.columns[indexToHide].options.display = false;
        });
      }
    }
    
    componentWillUnmount() {
        this.unsubscribeEvents();
    }

    onEventsUpdate = (querySnapshot) => {
        let events = [];

        if(this.props.type === "admin"){
          querySnapshot.forEach((doc) => {
            const eventObj = doc.data();
            eventObj.key = doc.id;

            eventObj.start_time = moment(eventObj.start_time.toDate()).format("DD.MM.YYYY HH:mm");

            events.push(eventObj);
          });
        } else {
          querySnapshot.forEach((doc) => {
            const eventObj = doc.data();
            if(this.calendars.some(r=> eventObj.event_tags.indexOf(r) >= 0)){
              eventObj.key = doc.id;
  
              eventObj.start_time = moment(eventObj.start_time.toDate()).format("DD.MM.YYYY HH:mm");
  
              events.push(eventObj);
            }
          });
        }

        this.setState({
            events,
            loadingEvents: false,
        });
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
            }
        };

        if(this.state.loadingEvents){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
        }

        return (
            <MUIDataTable
                title={this.props.title}
                data={this.state.events}
                columns={this.tableData.columns}
                options={options}
            />
        );

    }
}
