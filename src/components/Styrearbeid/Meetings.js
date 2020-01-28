import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Meeting from './Meeting';
import MeetingModal from './MeetingModal';

import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import Scrollable from '../Common/Scrollable'

export default class Meetings extends Component {
    constructor() {
        super();

        this.meetingsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings`);

        this.unsubscribeMeetings = null;
        
        this.state = {
            loadingMeetings: true,
            meetings: [
            ],
            dropdownMeetingsOpen: false
        };
    }

    componentDidMount() {
        this.unsubscribeMeetings = this.meetingsRef.orderBy("date", "desc").onSnapshot(this.onMeetingsUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeMeetings();
    }

    toggleMeetingsDD = () => {
        this.setState({
            dropdownMeetingsOpen: !this.state.dropdownMeetingsOpen
        });
    }

    onMeetingsUpdate = (querySnapshot) => {
        let meetings = [];
      
        querySnapshot.forEach((doc) => {
          const meetingObj = doc.data();
          meetingObj.key = doc.id;
          meetings.push(meetingObj);
        });

        this.setState({ 
            meetings,
            loadingMeetings: false,
        });
    }

    render() {
        function meetings(loading, meetings){
            if(loading){
                return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                let meetingsList = meetings.map((meetingObj, index) => (
                    <Meeting key={index} meetingObj={meetingObj}></Meeting>
                ));
                return meetingsList;
            }
            
        }

        return (
            <div>
                <div className="card-header">
                    <Dropdown className="float-right" isOpen={this.state.dropdownMeetingsOpen} toggle={this.toggleMeetingsDD}>
                        <DropdownToggle className="btn-sm">Aktive</DropdownToggle>
                        <DropdownMenu className="dropdown-menu-right-forced fadeInLeft animated">
                            <DropdownItem>Aktive</DropdownItem>
                            <DropdownItem>Arkivert</DropdownItem>
                            <DropdownItem>Alle</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <div className="card-title">{this.props.title}</div>
                </div>

                <MeetingModal></MeetingModal>

                <Scrollable className="list-group card-body" height={this.props.height}>
                    {meetings(this.state.loadingMeetings, this.state.meetings)}
                </Scrollable>
            </div>
        );
    }
}
