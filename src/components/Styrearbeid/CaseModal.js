import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

import swal from 'sweetalert';

import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import FormValidator from '../Forms/FormValidator.js';

export default class CaseModal extends Component {
    constructor(props, context) {
        super();

        this.state = {
            meetingId: props.meetingId,
            meetingName: props.meetingName,
            modalCase: false,
            formCase: {
                title: '',
                description: ''
            }
        };
    }

    componentDidMount() {
        //this.unsubscribeCases = this.casesRef.orderBy("created", "desc").onSnapshot(this.onCasesUpdate);
    }
    
    componentWillUnmount() {
        //this.unsubscribeCases();
    }

    validateOnChange = event => {
        const input = event.target;
        const form = input.form
        const value = input.type === 'checkbox' ? input.checked : input.value;

        const result = FormValidator.validate(input);

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                [input.name]: value,
                errors: {
                    ...this.state[form.name].errors,
                    [input.name]: result
                }
            }
        });

    }

    onSubmitCase = e => {
        const form = e.target;
        const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        if(!hasError){
            let tstate = this;
            this.setState({
                modalCaseLoading: true
            });

            let caseObj = {
                title: this.state.formCase.title,
                description: this.state.formCase.description,
                created: firebaseTimestamp.fromDate(new Date()),
                altered: firebaseTimestamp.fromDate(new Date())
            }

            let caseRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/cases`).doc();

            let submitBatch = DB.batch();

            submitBatch.set(caseRef, caseObj);

            if(tstate.state.meetingId){
                let meetingCaseObj = {
                    title: caseObj.title,
                    case: DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/cases/${caseRef.id}`),
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
                let casePostRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/cases/${caseRef.id}/posts`).doc();

                submitBatch.set(meetingCaseRef, meetingCaseObj);
                submitBatch.set(casePostRef, casePostObj);
            }
            
            submitBatch.commit().then(function () {
                swal("Ok", "Saken har blitt lagt til", "success");

                tstate.setState({
                    modalCaseLoading: false,
                    modalCase: false,
                    formCase: {
                        title: '',
                        description: ''
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
                                    <label className="col-md-2 col-form-label"><Trans i18nKey='components.cases.CASE_NAME'></Trans></label>
                                    <Col md={ 8 }>
                                        <Input type="text"
                                            name="title"
                                            invalid={tstate.hasError('formCase','title','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formCase.title}
                                        />
                                        <span className="invalid-feedback"><Trans i18nKey='utility.REQUIRED'></Trans></span>
                                    </Col>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label"><Trans i18nKey='components.cases.CASE_DESCRIPTION'></Trans></label>
                                    <Col md={ 8 }>
                                        <Input type="textarea"
                                            name="description"
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            value={tstate.state.formCase.description}
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
                <Button color="primary" onClick={this.toggleModalCase.bind(this)}><Trans i18nKey='components.cases.ADD_BUTTON'></Trans></Button>

                <Modal isOpen={this.state.modalCase} toggle={this.toggleModalCase.bind(this)}>
                    <ModalHeader toggle={this.toggleModalCase.bind(this)}><Trans i18nKey='components.cases.CASE'></Trans></ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.modalCaseLoading, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="formCase"><Trans i18nKey='utility.SAVE_BUTTON'></Trans></Button>{' '}
                        <Button color="secondary" onClick={this.toggleModalCase.bind(this)}><Trans i18nKey='utility.CANCEL_BUTTON'></Trans></Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}
