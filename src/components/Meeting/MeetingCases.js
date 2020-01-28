import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import MeetingCase from './MeetingCase';
import CaseBody from '../Case/Case';
import CaseModal from '../Styrearbeid/CaseModal';
import CaseImportModal from '../Styrearbeid/CaseImportModal';

import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';
import * as moment from 'moment';

import ScrollArea from 'react-scrollbar';

export default class MeetingCases extends Component {
    constructor(props, context) {
        super();

        this.meetingCasesRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${props.meetingId}/cases`);
        
        this.unsubscribeMeetingCases = null;
        
        this.state = {
            loadingMeetingCases: true,
            cases: [
            ],
            dropdownCasesOpen: false,
            caseStep: 0,
            caseId: ""
        };
    }

    componentDidMount() {
        this.unsubscribeMeetingCases = this.meetingCasesRef.orderBy("created", "asc").onSnapshot(this.onMeetingCasesUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeMeetingCases();
    }

    onMeetingCasesUpdate = (querySnapshot) => {
        let cases = [];
      
        querySnapshot.forEach((doc) => {
          const caseObj = doc.data();
          caseObj.key = doc.id;
          cases.push(caseObj);
        });

        this.setState({ 
            cases,
            loadingMeetingCases: false,
        });
    }

    displayCases() {
        this.setState({
            caseStep: 0,
            caseId: ""
        });
    }

    openCase(state, caseId, event) {
        state.setState({
            caseStep: 1
        });
        setTimeout(function(){
            state.setState({
                caseStep: 2,
                caseId: caseId
            });
        }, 10);
    }

    render() {
        function cases(loading, cases, state, onClick){
            if(loading){
                return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                let casesList = cases.map((caseObj, index) => {
                    if(state.state.caseId == caseObj.case.id){
                        return <MeetingCase key={index} caseObj={caseObj} active={true} onClick={onClick.bind(this, state, caseObj.case.id)}></MeetingCase>;
                    }
                    return <MeetingCase key={index} caseObj={caseObj} onClick={onClick.bind(this, state, caseObj.case.id)}></MeetingCase>;
                });
                return casesList;
            }
        }

        if(this.state.loadingMeetingCases){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                <div></div>
                <div></div>
                <div></div>
            </div>;
        } else if(this.state.caseStep === 0){
            if(this.state.cases.length === 0){
                return (
                    <div className="card-title"><h3>{this.props.meetingObj.title}</h3>
                        <p><b><Trans i18nKey='components.meetings.MEETING_TIME'></Trans>: </b> {moment(this.props.meetingObj.date.toDate()).format("DD.MM.YYYY HH:mm")}</p>
                        
                        <div className="card-title"><h3><Trans i18nKey='components.cases.CASES'></Trans></h3></div>
                        <div>
                            <CaseModal meetingId={this.props.meetingId} meetingName={this.props.meetingName}></CaseModal>
                            <CaseImportModal meetingId={this.props.meetingId} meetingName={this.props.meetingName}></CaseImportModal>

                            <ScrollArea
                                speed={0.8}
                                className="card-body"
                                contentClassName="content"
                                horizontal={true}
                                vertical={true}
                                style={{"height": this.props.height}}
                                >
                                <div><p>Det er ikke lagt inn noen saker for dette møtet enda</p></div>
                            </ScrollArea>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="card-title"><h3>{this.props.meetingObj.title}</h3>
                        <p><b><Trans i18nKey='components.meetings.MEETING_TIME'></Trans>: </b> {moment(this.props.meetingObj.date.toDate()).format("DD.MM.YYYY HH:mm")}</p>
                        
                        <div className="card-title"><h3><Trans i18nKey='components.cases.CASES'></Trans></h3></div>
                        <div>
                        <CaseModal meetingId={this.props.meetingId} meetingName={this.props.meetingName}></CaseModal>
                        <CaseImportModal meetingId={this.props.meetingId} meetingName={this.props.meetingName}></CaseImportModal>

                        <ScrollArea
                            speed={0.8}
                            className="card-body"
                            contentClassName="content"
                            horizontal={true}
                            vertical={true}
                            style={{"height": this.props.height}}
                            >
                            {cases(this.state.loadingCases, this.state.cases, this, this.openCase)}
                        </ScrollArea>
                        </div>
                    </div>
                );
            }
        } else if(this.state.caseStep === 1){
            return (
                    <Row>
                        <Col xl={3}>
                            <div className="card-title"><h3>{this.props.meetingObj.title}</h3>
                                <p><b><Trans i18nKey='components.meetings.MEETING_TIME'></Trans>: </b> {moment(this.props.meetingObj.date.toDate()).format("DD.MM.YYYY HH:mm")}</p>
                                
                                <div className="card-title"><h3><Trans i18nKey='components.cases.CASES'></Trans></h3></div>
                                <div>
                                <CaseModal meetingId={this.props.meetingId} meetingName={this.props.meetingName}></CaseModal>
                                <CaseImportModal meetingId={this.props.meetingId} meetingName={this.props.meetingName}></CaseImportModal>

                                <ScrollArea
                                    speed={0.8}
                                    className="card-body"
                                    contentClassName="content"
                                    horizontal={true}
                                    vertical={true}
                                    style={{"height": this.props.height}}
                                    >
                                    {cases(this.state.loadingCases, this.state.cases, this, this.openCase)}
                                </ScrollArea>
                                </div>
                            </div>
                        </Col>
                        <Col xl={9}>
                            <div>
                                {/*<Button style={{marginBottom: "15px"}} color="primary" onClick={this.displayCases.bind(this)}>Lukk</Button>*/}
                            </div>
                        </Col>
                    </Row>
            );
        } else if(this.state.caseStep === 2){
            return (
                    <Row>
                        <Col xl={3}>
                            <div className="card-title"><h3>{this.props.meetingObj.title}</h3>
                                <p><b><Trans i18nKey='components.meetings.MEETING_TIME'></Trans>: </b> {moment(this.props.meetingObj.date.toDate()).format("DD.MM.YYYY HH:mm")}</p>
                                
                                <div className="card-title"><h3><Trans i18nKey='components.cases.CASES'></Trans></h3></div>
                                <div>
                                <CaseModal meetingId={this.props.meetingId} meetingName={this.props.meetingName}></CaseModal>
                                <CaseImportModal meetingId={this.props.meetingId} meetingName={this.props.meetingName}></CaseImportModal>

                                <ScrollArea
                                    speed={0.8}
                                    className="card-body"
                                    contentClassName="content"
                                    horizontal={true}
                                    vertical={true}
                                    style={{"height": this.props.height}}
                                    >
                                    {cases(this.state.loadingCases, this.state.cases, this, this.openCase)}
                                </ScrollArea>
                                </div>
                            </div>
                        </Col>
                        <Col xl={9}>
                            <div>
                                {/*<Button style={{marginBottom: "15px"}} color="primary" onClick={this.displayCases.bind(this)}>Lukk</Button>*/}

                                <CaseBody caseId={this.state.caseId} meetingId={this.props.meetingId} meetingName={this.props.meetingName} view={"meeting"}></CaseBody>
                            </div>
                        </Col>
                    </Row>
            );
        }
        
    }
}
