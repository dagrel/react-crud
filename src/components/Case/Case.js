import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import CasePosts from './CasePosts.js';
import MeetingCasePosts from './MeetingCasePosts.js';
import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import Scrollable from '../Common/Scrollable'

export default class Case extends Component {
    constructor(props, context) {
        super();

        this.caseRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/cases/${props.caseId}`);

        this.unsubscribeCase = null;
        
        this.state = {
            caseId: props.caseId,
            loading: false,
            case: {
                title: "",
                description: "",
            }
        };
    }

    componentDidMount() {
        this.unsubscribeCase = this.caseRef.onSnapshot(this.onCaseUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeCase();
    }

    onCaseUpdate = (querySnapshot) => {
        let caseObj = querySnapshot.data();

        if(caseObj !== undefined){
            this.setState({ 
                case: caseObj,
                loading: false,
            });
        }
    }

    render() {
        if(this.state.loading){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                <div></div>
                <div></div>
                <div></div>
            </div>;
        } else {
            if(this.props.view === "meeting"){
                return (
                    <div className="">
                        <Row>
                            <Col>
                                <div className="card-title"><h3>{this.state.case.title}</h3></div>
                                <p><b><Trans i18nKey='components.cases.CASE_DESCRIPTION'></Trans>:</b> {this.state.case.description}</p>
                            </Col>
                        </Row>
                        <MeetingCasePosts caseId={this.props.caseId} meetingId={this.props.meetingId} meetingName={this.props.meetingName} height="200"></MeetingCasePosts>
                    </div>
                );
            } else {
                return (
                    <div className="">
                        <Row>
                            <Col>
                                <div className="card-title"><h3>{this.state.case.title}</h3></div>
                                <p><b><Trans i18nKey='components.cases.CASE_DESCRIPTION'></Trans>:</b> {this.state.case.description}</p>
                            </Col>
                        </Row>
                        <CasePosts caseId={this.props.caseId} height="463"></CasePosts>
                    </div>
                );
            }
            
        }
    }
}
