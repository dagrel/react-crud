import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, ButtonDropdown, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Select from 'react-select';
import swal from 'sweetalert';

import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import FormValidator from '../Forms/FormValidator.js';

export default class MessageModal extends Component {
    constructor(props, context) {
        super();

        this.membersRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/persons`);

        this.state = {
            modalMessage: false,
            formMessage: {
                receivers: [],
                title: '',
                body: ''
            }
        };
    }

    componentDidMount() {
        this.unsubscribeMembers = this.membersRef.orderBy("first_name", "asc").onSnapshot(this.onMembersUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeMembers();
    }

    onMembersUpdate = (querySnapshot) => {
        let receivers = [];
      
        querySnapshot.forEach((doc) => {
            const memberObj = {
                value: doc.id,
                label: `${doc.data().first_name} ${doc.data().last_name}`
            };
            receivers.push(memberObj);
        });
        
        this.setState({ 
            receivers
        });
    }

    validateOnChange = event => {
        if(Array.isArray(event)){
            this.setState({
                formMessage: {
                    members: event,
                }
            });
        } else {
            const input = event.target;
            const form = input.form;
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
    }

    onSubmitMessage = e => {
        /*
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
                modalMessageLoading: true
            });

            let messageObj = {
                title: this.state.formMessage.title,
                description: this.state.formMessage.description,
                created: firebaseTimestamp.fromDate(new Date()),
                altered: firebaseTimestamp.fromDate(new Date())
            }

            let messageRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/messages`).doc();

            let submitBatch = DB.batch();

            submitBatch.set(messageRef, messageObj);

            if(tstate.state.meetingId){
                let meetingMessageObj = {
                    title: messageObj.title,
                    message: DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/messages/${messageRef.id}`),
                    comment: "",
                    created: firebaseTimestamp.fromDate(new Date())
                }
    
                let messagePostObj = {
                    by: `Møte: ${tstate.state.meetingName}`,
                    meeting: DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${tstate.state.meetingId}`),
                    created: firebaseTimestamp.fromDate(new Date()),
                    description: `Saken ble lagt til i møtet ${tstate.state.meetingName}`
                }
    
                let meetingMessageRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${tstate.state.meetingId}/messages`).doc();
                let messagePostRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/messages/${messageRef.id}/posts`).doc();

                submitBatch.set(meetingMessageRef, meetingMessageObj);
                submitBatch.set(messagePostRef, messagePostObj);
            }
            
            submitBatch.commit().then(function () {
                swal("Ok", "Saken har blitt lagt til", "success");

                tstate.setState({
                    modalMessageLoading: false,
                    modalMessage: false,
                    formMessage: {
                        title: '',
                        description: ''
                    }
                });
            }).catch(err => {
                console.log(err);
                swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");

                tstate.setState({
                    modalMessageLoading: false
                });
            });
        }
        */
        e.preventDefault();
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return  this.state[formName] &&
                this.state[formName].errors &&
                this.state[formName].errors[inputName] &&
                this.state[formName].errors[inputName][method]
    }

    toggleModalMessage() {
        this.setState(prevState => ({
          modalMessage: !prevState.modalMessage
        }));
    }

    toggleDD() {
        this.setState({
            ddOpen: !this.state.ddOpen
        });
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
                return <form onSubmit={tstate.onSubmitMessage.bind(tstate)} action="" name="formMessage" id="formMessage">
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label"><Trans i18nKey='components.members_modal.SELECT_MEMBERS'></Trans></label>
                                    <Col md={ 8 }>
                                        <Select
                                            name="member"
                                            invalid={tstate.hasError('formMember','member','required')}
                                            options={tstate.state.receivers}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            isMulti={true}
                                            data-validate='["required"]'
                                        />
                                        <span className="invalid-feedback">Må velges</span>
                                    </Col>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label"><Trans i18nKey='components.messages.MESSAGE_TITLE'></Trans></label>
                                    <Col md={ 8 }>
                                        <Input type="text"
                                            name="title"
                                            invalid={tstate.hasError('formMessage','title','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formMessage.title}
                                        />
                                        <span className="invalid-feedback"><Trans i18nKey='utility.REQUIRED'></Trans></span>
                                    </Col>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label"><Trans i18nKey='components.messages.MESSAGE_BODY'></Trans></label>
                                    <Col md={ 8 }>
                                        <Input type="textarea"
                                            name="description"
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            value={tstate.state.formMessage.description}
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
                <ButtonDropdown isOpen={this.state.ddOpen} toggle={() => this.toggleDD()}>
                    <DropdownToggle caret color="primary">
                        <Trans i18nKey='components.messages.SEND_BUTTON'></Trans>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={this.toggleModalMessage.bind(this)}>Send Email</DropdownItem>
                        <DropdownItem onClick={this.toggleModalMessage.bind(this)}>Send SMS</DropdownItem>
                        <DropdownItem onClick={this.toggleModalMessage.bind(this)}><Trans i18nKey='components.messages.SEND_BUTTON'></Trans></DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown>

                <Modal isOpen={this.state.modalMessage} toggle={this.toggleModalMessage.bind(this)}>
                    <ModalHeader toggle={this.toggleModalMessage.bind(this)}><Trans i18nKey='components.messages.MESSAGE'></Trans></ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.modalMessageLoading, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="formMessage"><Trans i18nKey='components.messages.SEND_BUTTON'></Trans></Button>{' '}
                        <Button color="secondary" onClick={this.toggleModalMessage.bind(this)}><Trans i18nKey='utility.CANCEL_BUTTON'></Trans></Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}
