import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Table } from 'reactstrap';
//import PersonElement2 from './PersonElement2';
import MUIDataTable from "mui-datatables";
//import PersonBody from '../Person/Person';
//import PersonModal from './PersonModal';
import { attendanceColumns } from '../Common/tables';

import { DB, OrgKey, CalKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import ScrollArea from 'react-scrollbar';
import * as moment from 'moment';

/*
function Attendance(props) {
  return (
    <tr>
        <td>
            <a href="#">Vakt</a>
        </td>
        <td>Skal være vakt for...</td>
        <td className="text-center">
            <span className="badge badge-warning">På vent</span>
        </td>
    </tr>
  );
}
*/

export default class EventMembersTable extends Component {
  constructor(props, context) {
        super();

        this.attendanceRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/events/${props.eventId}/attendance`);
        this.personsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/persons`);

        this.unsubscribeEventAttendance = null;

        this.tableData = {
          columns:[]
        }
        
        this.state = {
            loadingAttendance: true,
            attendance: [
            ],
            dropdownAttendanceOpen: false
        };
    }

    componentDidMount() {
      this.unsubscribeAttendance = this.attendanceRef.onSnapshot(this.onAttendanceUpdate);
      this.tableData.columns = attendanceColumns;
    }
    
    componentWillUnmount() {
        this.unsubscribeAttendance();
    }

    onAttendanceUpdate = (querySnapshot) => {
      let tState = this;
      this.personsRef.get().then(function(persons) {
        let attendance = [];

        persons.forEach((doc) => {
          const personObj = doc.data();
          if(tState.props.eventTags.some(r=> personObj.event_tags.indexOf(r) >= 0)){
            personObj.key = doc.id;
            personObj.status = "kommer";
            personObj.attendance_comment = "";

            attendance.push(personObj);
          }
        });

        tState.setState({
            attendance,
            loadingAttendance: false,
        });
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
                }
            }
        };

        const attendanceList = this.state.attendance.map((attendance) =>
          <tr key={attendance.key}>
              <td>
                  <a href="#">{`${attendance.first_name} ${attendance.last_name}`}</a>
              </td>
              <td>
                {attendance.attendance_comment}
              </td>
              <td className="text-center">
                  <span className="badge badge-success">{attendance.status}</span>
              </td>
          </tr>
        );

        if(this.state.loadingAttendance){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
        }

        /*
          <MUIDataTable
              title={this.props.title}
              data={this.state.attendance}
              columns={this.tableData.columns}
              options={options}
          />
        */

        return (
            <Table hover bordered striped responsive>
              <thead>
                  <tr>
                      <th>Navn</th>
                      <th>Kommentar</th>
                      <th className="text-center">Status</th>
                  </tr>
              </thead>
              <tbody>
                {attendanceList}
              </tbody>
          </Table>
        );

    }
}