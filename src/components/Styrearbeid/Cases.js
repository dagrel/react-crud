import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Case from './Case';
import CaseBody from '../Case/Case';
import CaseModal from './CaseModal';

import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import ScrollArea from 'react-scrollbar';

export default class Cases extends Component {
    constructor() {
        super();

        this.casesRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/cases`);

        this.unsubscribeCases = null;
        
        this.state = {
            loadingCases: true,
            cases: [
            ],
            dropdownCasesOpen: false,
            caseStep: 0,
            caseId: ""
        };
    }

    componentDidMount() {
        this.unsubscribeCases = this.casesRef.orderBy("created", "desc").onSnapshot(this.onCasesUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeCases();
    }

    onCasesUpdate = (querySnapshot) => {
        let cases = [];
      
        querySnapshot.forEach((doc) => {
          const caseObj = doc.data();
          caseObj.key = doc.id;
          cases.push(caseObj);
        });

        this.setState({ 
            cases,
            loadingCases: false,
        });
    }

    toggleCasesDD = () => {
        this.setState({
            dropdownCasesOpen: !this.state.dropdownCasesOpen
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
                    if(state.state.caseId == caseObj.key){
                        return <Case key={index} caseObj={caseObj} active={true} onClick={onClick.bind(this, state, caseObj.key)}></Case>;
                    }
                    return <Case key={index} caseObj={caseObj} onClick={onClick.bind(this, state, caseObj.key)}></Case>;
                });
                return casesList;
            }
        }

        if(this.state.caseStep == 0){
            return (
                <div>
                    <div className="card-header">
                        <Dropdown className="float-right" isOpen={this.state.dropdownCasesOpen} toggle={this.toggleCasesDD}>
                            <DropdownToggle className="btn-sm">Aktive</DropdownToggle>
                            <DropdownMenu className="dropdown-menu-right-forced fadeInLeft animated">
                                <DropdownItem>Aktive</DropdownItem>
                                <DropdownItem>Arkivert</DropdownItem>
                                <DropdownItem>Alle</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <div className="card-title">{this.props.title}</div>
                    </div>
    
                    <CaseModal></CaseModal>

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
            );
        } else if(this.state.caseStep == 1){
            return (
                    <Row>
                        <Col xl={5}>
                            <div>
                                <div className="card-header">
                                    <Dropdown className="float-right" isOpen={this.state.dropdownCasesOpen} toggle={this.toggleCasesDD}>
                                        <DropdownToggle className="btn-sm">Aktive</DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-right-forced fadeInLeft animated">
                                            <DropdownItem>Aktive</DropdownItem>
                                            <DropdownItem>Arkivert</DropdownItem>
                                            <DropdownItem>Alle</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <div className="card-title">{this.props.title}</div>
                                </div>
                
                                <CaseModal></CaseModal>

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
                        </Col>
                        <Col xl={7}>
                            <div>
                                <div className="card-header">
                                    <div className="card-title"><Trans i18nKey='components.cases.CASE'></Trans></div>
                                </div>
                                
                                <Button style={{marginBottom: "15px"}} color="primary" onClick={this.displayCases.bind(this)}><Trans i18nKey='utility.CLOSE_BUTTON'></Trans></Button>
                            </div>
                        </Col>
                    </Row>
            );
        } else if(this.state.caseStep == 2){
            return (
                    <Row>
                        <Col xl={5}>
                            <div>
                                <div className="card-header">
                                    <Dropdown className="float-right" isOpen={this.state.dropdownCasesOpen} toggle={this.toggleCasesDD}>
                                        <DropdownToggle className="btn-sm">Aktive</DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-right-forced fadeInLeft animated">
                                            <DropdownItem>Aktive</DropdownItem>
                                            <DropdownItem>Arkivert</DropdownItem>
                                            <DropdownItem>Alle</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <div className="card-title">{this.props.title}</div>
                                </div>
                
                                <CaseModal></CaseModal>

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
                        </Col>
                        <Col xl={7}>
                            <div>
                                <div className="card-header">
                                    <div className="card-title"><Trans i18nKey='components.cases.CASE'></Trans></div>
                                </div>
                                
                                <Button style={{marginBottom: "15px"}} color="primary" onClick={this.displayCases.bind(this)}><Trans i18nKey='utility.CLOSE_BUTTON'></Trans></Button>

                                <CaseBody caseId={this.state.caseId}></CaseBody>
                            </div>
                        </Col>
                    </Row>
            );
        }

    }
}
