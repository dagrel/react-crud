import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
//import PersonElement2 from './PersonElement2';
import MUIDataTable from "mui-datatables";
//import PersonBody from '../Person/Person';
//import PersonModal from './PersonModal';

import { DB, OrgKey, CalKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import ScrollArea from 'react-scrollbar';
import * as moment from 'moment';

import { Calendar, momentLocalizer } from 'react-big-calendar'
//import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer by providing the moment
const localizer = momentLocalizer(moment);

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
    }
    
    componentWillUnmount() {
        this.unsubscribeEvents();
    }

    onEventsUpdate = (querySnapshot) => {
        let events = [];

        querySnapshot.forEach((doc) => {
            const eventObj = doc.data();
            if(this.calendars.some(r=> eventObj.event_tags.indexOf(r) >= 0)){
                eventObj.key = doc.id;

                let calObj = {
                    id: eventObj.key,
                    title: eventObj.title,
                    start: eventObj.start_time.toDate(),
                    end: eventObj.end_time.toDate(),
                    allDay: true,
                    style: {
                        backgroundColor: '#f56954',
                        borderColor: '#f56954'
                    }
                };

                events.push(calObj);
            }
        });

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
            <ContentWrapper>
                <div className="content-heading">
                    <div>
                        Kalender
                    </div>
                </div>
                <Row>
                    <Col>
                        <div className="card card-default">
                            <Calendar
                                localizer={localizer}
                                style={{minHeight: 700}}
                                selectable
                                events={this.state.events}
                                onEventDrop={this.moveEvent}
                                resizable
                                onEventResize={this.resizeEvent}
                                onSelectEvent={this.selectEvent}
                                defaultView="month"
                                defaultDate={new Date()}
                                eventPropGetter={this.parseStyleProp}
                                views={['month']}
                            />
                            {/* START card footer */}
                        </div>
                    </Col>
                </Row>
            </ContentWrapper>
        );

    }
}
