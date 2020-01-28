import React, { Component } from 'react';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, CustomInput } from 'reactstrap';
// DateTimePicker
import moment from 'moment';
import Datetime from 'react-datetime';
import Select from 'react-select';
import 'react-datetime/css/react-datetime.css';

import swal from 'sweetalert';

import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import FormValidator from '../Forms/FormValidator.js';

export default class EventsModal extends Component {
    constructor() {
        super();

        this.state = {
            modalEvent: false,
            formEvent: {
                title: '',
                start_time: moment(new Date()),
                end_time: moment(new Date()),
                place: '',
                address: '',
                comment_internal: '',
                comment_public: '',
                tag_all: false,
                group_tags: [],
                department_tags: [],
                person_tags: [],
            },
            groups: [
                {
                    label: "Gruppe 1",
                    value: "group-1"
                },
                {
                    label: "Gruppe 2",
                    value: "group-2"
                },{
                    label: "Gruppe 3",
                    value: "group-3"
                }
            ],
            departments: [
                {
                    label: "Avdeling 1",
                    value: "department-1"
                },
                {
                    label: "Avdeling 2",
                    value: "department-2"
                },{
                    label: "Avdeling 3",
                    value: "department-3"
                }
            ],
            persons: [
                {
                    label: "Person 1",
                    value: "person-1"
                },
                {
                    label: "Person 2",
                    value: "person-2"
                },{
                    label: "Person 3",
                    value: "person-3"
                }
            ]
        };
    }

    componentDidMount() {
        //this.unsubscribeEvents = this.eventsRef.orderBy("created", "desc").onSnapshot(this.onEventsUpdate);
    }
    
    componentWillUnmount() {
        //this.unsubscribeEvents();
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

    selectGroupOnChange = value => {
        let formData = this.state.formEvent;
        formData.group_tags = value;
        this.setState({
            formEvent: formData
        });
    }

    selectDepartmentOnChange = value => {
        let formData = this.state.formEvent;
        formData.department_tags = value;
        this.setState({
            formEvent: formData
        });
    }

    selectPersonOnChange = value => {
        let formData = this.state.formEvent;
        formData.person_tags = value;
        this.setState({
            formEvent: formData
        });
    }

    startDateOnChange = value => {
        let formData = this.state.formEvent;
        formData.start_time = value;
        this.setState({
            formEvent: formData
        });
    }

    endDateOnChange = value => {
        let formData = this.state.formEvent;
        formData.end_time = value;
        this.setState({
            formEvent: formData
        });
    }

    onSubmitEvent = e => {
        const form = e.target;
        const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName))
        let hasError = false;

        /*
        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });
        */

        if(!hasError){
            let tstate = this;
            this.setState({
                modalEventLoading: true
            });

            let event_tags = [];

            if(this.state.formEvent.tag_all){
                event_tags = ["all"];
            } else {
                let tags = this.state.formEvent.group_tags.concat(this.state.formEvent.department_tags, this.state.formEvent.person_tags);

                tags.forEach(tag => {
                    event_tags.push(tag.value);
                });
            }
            
            let eventObj = {
                title: this.state.formEvent.title,
                start_time: firebaseTimestamp.fromDate(moment(this.state.formEvent.start_time, "YYYY.MM.DD HH:mm").toDate()),
                end_time: firebaseTimestamp.fromDate(moment(this.state.formEvent.start_time, "YYYY.MM.DD HH:mm").toDate()),
                place: this.state.formEvent.place,
                address: this.state.formEvent.address,
                comment_internal: this.state.formEvent.comment_internal,
                comment_public: this.state.formEvent.comment_public,
                event_tags: event_tags,
                created: firebaseTimestamp.fromDate(new Date()),
                altered: firebaseTimestamp.fromDate(new Date())
            }

            DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/events`).doc().set(eventObj).then(function() {
                swal("Ok", "Aktiviteten har blitt lagt til", "success");

                tstate.setState({
                    modalEventLoading: false,
                    modalEvent: false,
                    formEvent: {
                        title: '',
                        start_time: moment(new Date()),
                        end_time: moment(new Date()),
                        place: '',
                        address: '',
                        comment_internal: '',
                        comment_public: '',
                        tag_all: false,
                        group_tags: [],
                        department_tags: [],
                        person_tags: [],
                    }
                });
            }).catch(err => {
                console.log(err);
                swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");

                tstate.setState({
                    modalEventLoading: false
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

    toggleModalEvent() {
        this.setState(prevState => ({
            formEvent: {
                title: '',
                start_time: moment(new Date()),
                end_time: moment(new Date()),
                place: '',
                address: '',
                comment_internal: '',
                comment_public: '',
                tag_all: false,
                group_tags: [],
                department_tags: [],
                person_tags: [],
            },
            modalEvent: !prevState.modalEvent
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
                return <form onSubmit={tstate.onSubmitEvent.bind(tstate)} action="" name="formEvent" id="formEvent">
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Tittel</label>
                                    <Col md={ 8 }>
                                        <Input type="text"
                                            name="title"
                                            invalid={tstate.hasError('formEvent','title','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formEvent.title}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Starter</label>
                                    <Col md={ 8 }>
                                        <Datetime
                                            inputProps={{ name: 'start_time' }}
                                            onChange={tstate.startDateOnChange.bind(tstate)}
                                            value={tstate.state.formEvent.start_time}
                                            locale="nb"
                                            timeFormat="HH:mm"
                                            dateFormat="DD.MM.YYYY"
                                            />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Slutter</label>
                                    <Col md={ 8 }>
                                        <Datetime
                                            inputProps={{ name: 'end_time' }}
                                            onChange={tstate.endDateOnChange.bind(tstate)}
                                            value={tstate.state.formEvent.end_time}
                                            locale="nb"
                                            timeFormat="HH:mm"
                                            dateFormat="DD.MM.YYYY"
                                            />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Adresse</label>
                                    <Col md={ 8 }>
                                        <Input type="text"
                                            name="address"
                                            invalid={tstate.hasError('formEvent','address','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            value={tstate.state.formEvent.address}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-2 col-form-label">Sted</label>
                                    <Col md={ 8 }>
                                        <Input type="text"
                                            name="place"
                                            invalid={tstate.hasError('formEvent','place','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            value={tstate.state.formEvent.place}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            </fieldset>
                            <p>Hvem skal være med?</p>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <CustomInput type="checkbox" id="terms"
                                        name="tag_all"
                                        label="Alle"
                                        invalid={tstate.hasError('formRegister','tag_all','required')}
                                        onChange={tstate.validateOnChange}
                                        checked={tstate.state.formEvent.tag_all}>
                                    </CustomInput>
                                </div>
                            </fieldset>

                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Velg grupper</label>
                                    <Col md={ 8 }>
                                        <Select
                                            name="group_tags"
                                            invalid={tstate.hasError('formMember','group_tags','required')}
                                            options={tstate.state.groups}
                                            onChange={tstate.selectGroupOnChange.bind(tstate)}
                                            isMulti={true}
                                            data-validate='["required"]'
                                        />
                                        <span className="invalid-feedback">Må velges</span>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Velg avdelinger</label>
                                    <Col md={ 8 }>
                                        <Select
                                            name="department_tags"
                                            invalid={tstate.hasError('formMember','department_tags','required')}
                                            options={tstate.state.departments}
                                            onChange={tstate.selectDepartmentOnChange.bind(tstate)}
                                            isMulti={true}
                                            data-validate='["required"]'
                                        />
                                        <span className="invalid-feedback">Må velges</span>
                                    </Col>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Velg personer</label>
                                    <Col md={ 8 }>
                                        <Select
                                            name="person_tags"
                                            invalid={tstate.hasError('formMember','person_tags','required')}
                                            options={tstate.state.persons}
                                            onChange={tstate.selectPersonOnChange.bind(tstate)}
                                            isMulti={true}
                                            data-validate='["required"]'
                                        />
                                        <span className="invalid-feedback">Må velges</span>
                                    </Col>
                                </div>
                            </fieldset>
                        </form>;
            }
        }
        return (
            <span style={{paddingLeft: "15px"}}>
                <Button color="primary" onClick={this.toggleModalEvent.bind(this)}>Opprett ny aktivitet</Button>

                <Modal isOpen={this.state.modalEvent} toggle={this.toggleModalEvent.bind(this)}>
                    <ModalHeader toggle={this.toggleModalEvent.bind(this)}>Aktivitet</ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.modalEventLoading, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="formEvent">Lagre</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModalEvent.bind(this)}>Avbryt</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}
