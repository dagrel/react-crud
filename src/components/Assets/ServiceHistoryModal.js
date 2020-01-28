import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, DropdownItem, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import moment from 'moment';
import Datetime from 'react-datetime';
import Select from 'react-select';
import 'react-datetime/css/react-datetime.css';
import swal from 'sweetalert';
import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import FormValidator from '../Forms/FormValidator.js';

export default class ServiceHistoryModal extends Component {
    constructor(props) {
        super() 

        // ta inn riktig itemId??
        
        this.serviceHistoryRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items/${props.itemId}/service-history`);
        
        this.unsubscribeService = null;

        this.state = {
            serviceModal: false,
            serviceId: props.itemId,
            serviceHistory: [],
            serviceForm: {
                createdBy: "",
                delivered: moment(new Date()),
                received: moment(new Date()),
                commentDelivered: "",
                commentReceived: "",
            }
        };
    }

    

    componentDidMount() {
       this.unsubscribeService = this.serviceHistoryRef.onSnapshot(this.onServiceUpdate);
    }

    componentWillUnmount() {
        this.unsubscribeService();
        
    }

    onServiceUpdate = (querySnapshot) => 
    {
        let serviceHistory = [];

        querySnapshot.forEach((doc) => 
        {
            let serviceObj = doc.data();
            serviceObj.key = doc.id;

            if(serviceObj.delivered) {serviceObj.delivered = moment(serviceObj.delivered.toDate()).format("DD.MM.YYYY");} 

            if(serviceObj.received) {serviceObj.received = moment(serviceObj.received.toDate()).format("DD.MM.YYYY");}
             
            serviceHistory.push(serviceObj);
        });
        
        this.setState({
            serviceHistory
        })
    }

    toggleModal() {
        this.setState(prevState => ({
            serviceForm: {
                createdBy: "",
                delivered: moment(new Date()),
                received: moment(new Date()),
                commentDelivered: "",
                commentReceived: "",
            },
            serviceModal: !prevState.serviceModal
        }));
    }

    

    validateOnChange = event => {
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

    // funksjon for valg av innleveringsdato
    deliveredOnChange = value => {
        let formData = this.state.serviceHistory;
        formData.delivered = value;
        this.setState({
            formEvent: formData
        });
    }

    // funksjon for valg av utleveringsdato
    receivedOnChange = value => {
        let formData = this.state.serviceForm;
        formData.received = value;
        this.setState({
            formEvent: formData
        });
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return  this.state[formName] &&
                this.state[formName].errors &&
                this.state[formName].errors[inputName] &&
                this.state[formName].errors[inputName][method]
    }

    onSubmitEvent = e => 
    {
        let hasError = false;
        var delivered = "";
        var received = "";
        let tstate = this;

        if(!hasError) 
        {
            if(this.state.serviceForm.delivered) {
                delivered = firebaseTimestamp.fromDate(moment(this.state.serviceForm.delivered, "YYYY.MM.DD").toDate())
            }

            if(this.state.serviceForm.received) {
                received = firebaseTimestamp.fromDate(moment(this.state.serviceForm.received, "YYYY.MM.DD").toDate())
            }

            let serviceObj = {
                createdBy: "",
                delivered: this.state.serviceForm.delivered,
                received: this.state.serviceForm.received,
                commentDelivered: this.state.serviceForm.commentDelivered,
                commentReceived: this.state.serviceForm.commentReceived,
                created: firebaseTimestamp.fromDate(new Date()),
                altered: firebaseTimestamp.fromDate(new Date()),
            }
            
            if (this.state.serviceId) 
            {
                DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items/${this.props.itemId}/service-history`).doc(this.state.serviceId).set(serviceObj).then(function() {
                   
                    tstate.setState({
                        serviceModalLoading: false,
                        serviceModal: false,
                        serviceForm: {
                            createdBy: "",
                            delivered: moment(new Date()),
                            received: moment(new Date()),
                            commentDelivered: "",
                            commentReceived: "",
                        }
                        
                    });
                }).catch(err => {
                    console.log(err);
                    swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");
    
                    tstate.setState({
                        serviceModal: false
                    });
                });
            
            }else
            {
                DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items/${this.props.itemId}/service-history`).doc().set(serviceObj).then(function() {
    
                    tstate.setState({
                        serviceModalLoading: false,
                        serviceModal: false,
                        serviceForm: {
                            createdBy: "",
                            delivered: moment(new Date()),
                            received: moment(new Date()),
                            commentDelivered: "",
                            commentReceived: "",
                        }
                    });
                }).catch(err => {
                    console.log(err);
                    swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");
    
                    tstate.setState({
                        serviceModal: false
                    });
                });
            }
        }
    }

    
    render() {
        function modalForm(loading, tstate)
        {
        if(loading)
        {
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
        }
        else 
        {
        return ( <form onSubmit={tstate.onSubmitEvent.bind(tstate)} name="serviceForm" id="serviceForm">
            <Row> 
            { /* kolonne 1*/ }
                <Col lg="12">  {/* Fikser slik at man får fleire kolonner, start fra venstre */}
                    <div className="col1">
                        <div className="form-group row align-items-center">
                            <label className="col-md-4 col-form-label">Opprettet av</label>
                            <Col md={ 6 }>
                                <Input type="text"
                                    name="createdBy"
                                    invalid={tstate.hasError('serviceForm','createdBy','required')}
                                    onChange={tstate.validateOnChange.bind(tstate)}
                                    data-validate='["required"]'
                                    value={tstate.state.serviceForm.createdBy}
                                />
                                <span className="invalid-feedback">Må fylles ut</span>
                            </Col>
                        </div>

                        <div className="form-group row align-items-center">
                            <label className="col-md-4 col-form-label">Utleveringsdato</label>
                            <Col md={ 6 }>
                                <Datetime
                                    inputProps={{ name: 'delivered' }}
                                    onChange={tstate.deliveredOnChange.bind(tstate)}
                                    value={tstate.state.serviceForm.delivered}
                                    locale="nb"
                                    dateFormat="DD.MM.YYYY" timeFormat={false}
                                    />
                                <span className="invalid-feedback">Må fylles ut</span>
                            </Col>
                        </div>

                        <div className="form-group row align-items-center">
                            <label className="col-md-4 col-form-label">Kommentar utlevert</label>
                            <Col md={ 6 }>
                                <Input type="textarea"
                                    name="commentDelivered"
                                    invalid={tstate.hasError('serviceForm','commentDelivered','required')}
                                    onChange={tstate.validateOnChange.bind(tstate)}
                                    data-validate='["required"]'
                                    value={tstate.state.serviceForm.commentDelivered}
                                />
                                <span className="invalid-feedback">Må fylles ut</span>
                            </Col>
                        </div>

                        <div className="form-group row align-items-center">
                            <label className="col-md-4 col-form-label">hentet / mottatt</label>
                            <Col md={ 6 }>
                                <Datetime
                                    inputProps={{ name: 'delivered' }}
                                    onChange={tstate.receivedOnChange.bind(tstate)}
                                    value={tstate.state.serviceForm.received}
                                    locale="nb"
                                    dateFormat="DD.MM.YYYY" timeFormat={false}
                                    />
                                <span className="invalid-feedback">Må fylles ut</span>
                            </Col>
                        </div>

                        <div className="form-group row align-items-center">
                            <label className="col-md-4 col-form-label">Kommentar mottatt</label>
                            <Col md={ 6 }>
                                <Input type="textarea"
                                    name="commentReceived"
                                    invalid={tstate.hasError('serviceForm','commentReceived','required')}
                                    onChange={tstate.validateOnChange.bind(tstate)}
                                    data-validate='["required"]'
                                    value={tstate.state.serviceForm.commentReceived}
                                />
                                <span className="invalid-feedback">Må fylles ut</span>
                            </Col>
                        </div>


                    </div>
                </Col>
            </Row>
            </form>
            
        
        )}; 
    } 
        return(
            <span>
                <div style={{ float: "right", }}>
                <Button  color="primary "className="fa-2x icon-plus mr-2" onClick={this.toggleModal.bind(this)}></Button>
                </div>

                <Modal isOpen={this.state.serviceModal} className="modal-m" toggle={this.toggleModal.bind(this)}>
                    <ModalHeader toggle={this.toggleModal.bind(this)}>Service historikk</ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.loading, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="serviceForm">Lagre</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal.bind(this)}>Avbryt</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}
