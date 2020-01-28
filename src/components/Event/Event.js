import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Card, CardHeader, CardBody, Row, Col, Alert, Table, FormGroup } from 'reactstrap';
import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';
import * as moment from 'moment';
import Scrollable from '../Common/Scrollable'
import EventMembersTable from './EventMembersTable';

export default class Event extends Component {
    constructor(props, context) {
        super();

        this.eventRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/events/${props.match.params.eventId}`);

        this.unsubscribeEvent = null;
        
        this.state = {
            eventId: props.match.params.eventId,
            loading: true,
            event: {}
        };
    }

    componentDidMount() {
        this.unsubscribeEvent = this.eventRef.onSnapshot(this.onEventUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeEvent();
    }

    onEventUpdate = (querySnapshot) => {
        let eventObj = querySnapshot.data();

        this.setState({
            event: eventObj,
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
                    <Card className="card-default">
                        <CardBody>
                            <Row>
                                <Col lg="12">
                                    <p className="lead bb">{this.state.event.title}</p>
                                    <form className="form-horizontal">
                                        <FormGroup row>
                                            <Col md="4">Fra:</Col>
                                            <Col md="8">
                                                <strong>{moment(this.state.event.start_time.toDate()).format("DD.MM.YYYY HH:mm")}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Til:</Col>
                                            <Col md="8">
                                                <strong>{moment(this.state.event.end_time.toDate()).format("DD.MM.YYYY HH:mm")}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Sted:</Col>
                                            <Col md="8">
                                                <strong>{this.state.event.place}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Adresse:</Col>
                                            <Col md="8">
                                                <strong>{this.state.event.address}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Status</Col>
                                            <Col md="8">
                                                <div className="badge badge-success">Aktiv</div>
                                            </Col>
                                        </FormGroup>
                                    </form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>Deltakere</CardHeader>
                        <EventMembersTable eventId={this.props.match.params.eventId} eventTags={this.state.event.event_tags}></EventMembersTable>
                    </Card>
                </ContentWrapper>
            );
        }
    }
}
