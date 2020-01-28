import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import MeetingCases from './MeetingCases.js';
import MeetingMembers from './MeetingMembers.js'
import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';
import * as moment from 'moment';
import Scrollable from '../Common/Scrollable'

export default class Meeting extends Component {
    constructor(props, context) {
        super();

        this.meetingRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${props.match.params.meetingId}`);

        this.unsubscribeMeeting = null;
        
        this.state = {
            meetingId: props.match.params.meetingId,
            loading: true,
            meeting: {
                title: "",
                description: "",
            }
        };
    }

    componentDidMount() {
        this.unsubscribeMeeting = this.meetingRef.onSnapshot(this.onMeetingUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeMeeting();
    }

    onMeetingUpdate = (querySnapshot) => {
        let meetingObj = querySnapshot.data();

        this.setState({
            meeting: meetingObj,
            loading: false,
        });
    }

    render() {

        if(this.state.loading){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                <div></div>
                <div></div>
                <div></div>
            </div>;
        } else {
            //<MeetingCases meetingId={this.props.match.params.meetingId} height="560"></MeetingCases>
            return (
                <ContentWrapper>
                    <Row>
                        <Col xl={ 9 }>
                            <div className="card card-default card-body">
                                <MeetingCases meetingObj={this.state.meeting} meetingId={this.props.match.params.meetingId} meetingName={this.state.meeting.title} height={"590px"}></MeetingCases>
                            </div>
                        </Col>
                        <Col xl={ 3 }>
                            <div className="card card-default">
                                <MeetingMembers meetingId={this.props.match.params.meetingId} meetingName={this.state.meeting.title} height={"590px"}></MeetingMembers>
                            </div>
                        </Col>
                    </Row>
                </ContentWrapper>

            );
        }
    }
}
