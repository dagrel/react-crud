import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Select from 'react-select';
import swal from 'sweetalert';

import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import FormValidator from '../Forms/FormValidator.js';

export default class CaseModal extends Component {
    constructor(props, context) {
        super();

        this.casesRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/cases`);

        this.state = {
            meetingId: props.meetingId,
            meetingName: props.meetingName,
            modalCase: false,
            modalCaseLoading: false,
            activeCases: [/*
                { value: '5gM1kF21N9VJmX6wAwuB', label: 'Ny sak fra test' },
                { value: '9gC9d0kvXXwyHabzr2HE', label: 'En ny sak' },
                { value: 'QRmuZpGDa5TDQNabLhLo', label: 'Nyeste sak' }
                */
            ],
            formCase: {
                caseId: '',
                caseName: ''
            }
        };
    }

    componentDidMount() {
        this.unsubscribeCases = this.casesRef.orderBy("title", "asc").onSnapshot(this.onCasesUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeCases();
    }

    onCasesUpdate = (querySnapshot) => {
        let activeCases = [];
      
        querySnapshot.forEach((doc) => {
            const caseObj = {
                value: doc.id,
                label: doc.data().title
            };
            activeCases.push(caseObj);
        });

        this.setState({ 
            activeCases
        });
    }

    validateOnChange = event => {
        this.setState({
            formCase: {
                caseId: event.value,
                caseName: event.label
            }
        });
    }

    onSubmitCase = e => {
        let caseId = this.state.formCase.caseId;
        let caseName = this.state.formCase.caseName;

        if(caseId){
            let tstate = this;
            this.setState({
                modalCaseLoading: true
            });

            let caseObj = {
                title: caseName,
                case: DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/cases/${caseId}`),
                comment: "",
                created: firebaseTimestamp.fromDate(new Date())
            }

            let casePostObj = {
                by: `Møte: ${tstate.state.meetingName}`,
                meeting: DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${tstate.state.meetingId}`),
                created: firebaseTimestamp.fromDate(new Date()),
                description: `Saken ble lagt til i møtet ${tstate.state.meetingName}`
            }

            let meetingCaseRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${tstate.state.meetingId}/cases`).doc();
            let casePostRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/cases/${caseId}/posts`).doc();

            let submitBatch = DB.batch();

            submitBatch.set(meetingCaseRef, caseObj);
            submitBatch.set(casePostRef, casePostObj);

            submitBatch.commit().then(function () {
                swal("Ok", "Saken har blitt lagt til", "success");

                tstate.setState({
                    modalCaseLoading: false,
                    modalCase: false,
                    formCase: {
                        caseId: '',
                        caseName: ''
                    }
                });
            }).catch(err => {
                console.log(err);
                swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");

                tstate.setState({
                    modalCaseLoading: false
                });
            });
        }

        e.preventDefault();
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return  this.state[formName] &&
                this.state[formName].errors &&
                this.state[formName].errors[inputName] &&
                this.state[formName].errors[inputName][method]
    }

    toggleModalCase() {
        this.setState(prevState => ({
          modalCase: !prevState.modalCase
        }));
    }

    render() {
        function modalForm(loading, tstate){
            if(loading){
                return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                return <form onSubmit={tstate.onSubmitCase.bind(tstate)} action="" name="formCase" id="formCase">
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label"><Trans i18nKey='components.cases.SELECT_CASE'></Trans></label>
                                    <Col md={ 8 }>
                                        <Select
                                            name="case"
                                            invalid={tstate.hasError('formCase','case','required')}
                                            options={tstate.state.activeCases}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                        />
                                        <span className="invalid-feedback"><Trans i18nKey='utility.REQUIRED'></Trans></span>
                                    </Col>
                                </div>
                            </fieldset>
                        </form>;
            }
        }
        return (
            <span style={{paddingLeft: "15px"}}>
                <Button color="primary" onClick={this.toggleModalCase.bind(this)}><Trans i18nKey='components.cases.GET_CASE'></Trans></Button>

                <Modal isOpen={this.state.modalCase} toggle={this.toggleModalCase.bind(this)}>
                    <ModalHeader toggle={this.toggleModalCase.bind(this)}><Trans i18nKey='components.cases.CASE'></Trans></ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.modalCaseLoading, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="formCase"><Trans i18nKey='components.cases.GET_CASE'></Trans></Button>{' '}
                        <Button color="secondary" onClick={this.toggleModalCase.bind(this)}><Trans i18nKey='utility.CANCEL_BUTTON'></Trans></Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}
