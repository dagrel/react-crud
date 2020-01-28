import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
// DateTimePicker
import moment from 'moment';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

import swal from 'sweetalert';

import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import FormValidator from '../Forms/FormValidator.js';

export default class MeetingModal extends Component {
    constructor() {
        super();

        this.state = {
            modalMeeting: false,
            formMeeting: {
                title: '',
                date: moment(new Date())
            }
        };
    }

    componentDidMount() {
        //this.unsubscribeMeetings = this.meetingsRef.orderBy("created", "desc").onSnapshot(this.onMeetingsUpdate);
    }
    
    componentWillUnmount() {
        //this.unsubscribeMeetings();
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

    dateOnChange = value => {
        let title = this.state.formMeeting.title;
        this.setState({
            formMeeting: {
                title: title,
                date: value
            }
        });
    }

    onSubmitMeeting = e => {
        const form = e.target;
        const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        console.log(firebaseTimestamp.fromDate(this.state.formMeeting.date.toDate()));
        
        if(!hasError){
            let tstate = this;
            this.setState({
                modalMeetingLoading: true
            });

            let meetingObj = {
                title: this.state.formMeeting.title,
                date: firebaseTimestamp.fromDate(moment(this.state.formMeeting.date, "YYYY.MM.DD HH:mm").toDate()),
                created: firebaseTimestamp.fromDate(new Date()),
                altered: firebaseTimestamp.fromDate(new Date())
            }

            DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings`).doc().set(meetingObj).then(function() {
                swal("Ok", "Møtet har blitt lagt til", "success");

                tstate.setState({
                    modalMeetingLoading: false,
                    modalMeeting: false,
                    formMeeting: {
                        title: '',
                        date: moment(new Date())
                    }
                });
            }).catch(err => {
                console.log(err);
                swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");

                tstate.setState({
                    modalMeetingLoading: false
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

    toggleModalMeeting() {
        this.setState(prevState => ({
          modalMeeting: !prevState.modalMeeting
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
                return <form onSubmit={tstate.onSubmitMeeting.bind(tstate)} action="" name="formMeeting" id="formMeeting">
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label"><Trans i18nKey='components.meetings.MEETING_NAME'></Trans></label>
                                    <Col md={ 8 }>
                                        <Input type="text"
                                            name="title"
                                            invalid={tstate.hasError('formMeeting','title','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formMeeting.title}
                                        />
                                        <span className="invalid-feedback"><Trans i18nKey='utility.REQUIRED'></Trans></span>
                                    </Col>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label"><Trans i18nKey='components.meetings.MEETING_TIME'></Trans></label>
                                    <Col md={ 8 }>
                                        <Datetime
                                            inputProps={{ name: 'date' }}
                                            onChange={tstate.dateOnChange.bind(tstate)}
                                            value={tstate.state.formMeeting.date}
                                            locale="nb"
                                            timeFormat="HH:mm"
                                            dateFormat="DD.MM.YYYY"
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
                <Button color="primary" onClick={this.toggleModalMeeting.bind(this)}><Trans i18nKey='components.meetings.ADD_BUTTON'></Trans></Button>

                <Modal isOpen={this.state.modalMeeting} toggle={this.toggleModalMeeting.bind(this)}>
                    <ModalHeader toggle={this.toggleModalMeeting.bind(this)}><Trans i18nKey='components.meetings.MEETING'></Trans></ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.modalMeetingLoading, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="formMeeting"><Trans i18nKey='utility.SAVE_BUTTON'></Trans></Button>{' '}
                        <Button color="secondary" onClick={this.toggleModalMeeting.bind(this)}><Trans i18nKey='utility.CANCEL_BUTTON'></Trans></Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}
