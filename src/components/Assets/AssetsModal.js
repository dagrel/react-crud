import React, { Component } from 'react';
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, DropdownItem, Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
// DateTimePicker
import moment from 'moment';
import Datetime from 'react-datetime';
import Select from 'react-select';
import 'react-datetime/css/react-datetime.css';

import swal from 'sweetalert';

import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import FormValidator from '../Forms/FormValidator.js';

export default class AssetModal extends Component {
    constructor(props) {
        super(props);

        this.assetRef = DB.doc(`/uni/qG7hSy1hnz9RpiIZ1u1u/contacts/${props.itemId}`)

        this.unsubscribeAsset = null;
        this.unsubscribeTypes = null;
        
        this.state = {
            assetId: props.itemId,
            modalAsset: false,
            formAsset: {
                ID: "",
                CreatedBy: "",
                InfoID: "",
                Comment: "",
                ParentBusinessRelationID: "",
                Role: "",
                variant: "",
                StatusCode: "",
                UpdatedBy: "",
                deleted: false
            },
        };
    }

    componentDidMount()  {
        this.unsubscribeAsset = this.assetRef.onSnapshot(this.onAssetUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeAsset();
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

    onAssetUpdate = (querySnapshot) => {
        let assetObj = querySnapshot.data();
        if(querySnapshot.exists) {
            this.setState({
                asset: assetObj,
            }); 
        }
    }

    onDelete = () => {
        let deleted = this.state.formAsset.deleted;
        this.setState({
            
        });
    }
    
    onSubmitEvent = e => {
        const form = e.target;
        let hasError = false;
        

        if(!hasError){

            if(this.state.formAsset.ID) {
                let tstate = this;
                this.setState({
                    modalAssetLoading: true
            });

            let assetObj = {
                ID: this.state.formAsset.ID,
                CreatedBy: this.state.formAsset.CreatedBy,
                InfoID: this.state.formAsset.InfoID,
                Comment: this.state.formAsset.Comment,
                ParentBusinessRelationID: this.state.formAsset.ParentBusinessRelationID,
                Role: this.state.formAsset.Role,
                StatusCode: this.state.formAsset.StatusCode,
                UpdatedBy: this.state.formAsset.UpdatedBy,
                created: firebaseTimestamp.fromDate(new Date()),
                altered: firebaseTimestamp.fromDate(new Date()), // flytt
            }
            if (this.state.assetId) {
            DB.collection(`/uni/qG7hSy1hnz9RpiIZ1u1u/contacts`).doc(this.state.assetId).set(assetObj).then(function() {
               

                tstate.setState({
                    modalAssetLoading: false,
                    modalAsset: false,
                    formAsset: {
                        ID: '',
                        CreatedBy: "",
                        InfoID: "",
                        Comment: "",
                        ParentBusinessRelationID: "",
                        Role: "",
                        StatusCode: "",
                        UpdatedBy: ""
                    }
                });
            }).catch(err => {
                console.log(err);
                swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");

                tstate.setState({
                    modalAssetLoading: false
                });
            });
        
        }else{
            DB.collection(`/uni/qG7hSy1hnz9RpiIZ1u1u/contacts`).doc().set(assetObj).then(function() {

                tstate.setState({
                    modalAssetLoading: false,
                    modalAsset: false,
                    formAsset: {
                        ID: '',
                        CreatedBy: "",
                        InfoID: "",
                        Comment: "",
                        Role: "",
                        ParentBusinessRelationID: "",
                        StatusCode: "",
                        UpdatedBy: "",
                        deleted: false
                    }
                });
            }).catch(err => {
                console.log(err);
                swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");

                tstate.setState({
                    modalAssetLoading: false
                });
            });
        }}}
        e.preventDefault();
    }

    onDelete = () => {
        var tstate = this;
        DB.collection(`/uni/qG7hSy1hnz9RpiIZ1u1u/contacts`).doc(tstate.state.assetId).get().then(function(snapshot) {
            let assetObj = snapshot.data();
            assetObj.deleted = true
            DB.collection(`/uni/qG7hSy1hnz9RpiIZ1u1u/contacts`).doc(tstate.state.assetId).set(assetObj).then(function(){
                window.location.href = "/instrumenter";
            })
        })
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return  this.state[formName] &&
                this.state[formName].errors &&
                this.state[formName].errors[inputName] &&
                this.state[formName].errors[inputName][method]
    }

    toggleModalAsset() {
        if(this.state.asset) {
            this.setState(prevState => ({
                formAsset: {
                    ID: this.state.asset.ID,
                    CreatedBy: this.state.asset.CreatedBy,
                    InfoID: this.state.asset.InfoID,
                    ParentBusinessRelationID: this.state.asset.ParentBusinessRelationID,
                    Comment: this.state.asset.Comment,
                    Role: this.state.asset.Role,
                    StatusCode: this.state.asset.StatusCode,
                    UpdatedBy: this.state.asset.UpdatedBy
                },
                modalAsset: !prevState.modalAsset
            }));
        } else {
        this.setState(prevState => ({
            formAsset: {
                ID: '',
                CreatedBy: "",
                InfoID: "",
                Comment: "",
                ParentBusinessRelationID: "",
                Role: "",
                StatusCode: "",
                UpdatedBy: ""
            },
            modalAsset: !prevState.modalAsset
        }));
    }}

    toggleDropDown = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    

    render() {
        function modalForm(loading, tstate){
            if(loading){
                return <div className="ball-moda" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                return ( <form onSubmit={tstate.onSubmitEvent.bind(tstate)} name="formAsset" id="formAsset">
                    <Row> 
                    { /* kolonne 1*/ }
                        <Col lg="4">  {/* Fikser slik at man får fleire kolonner, start fra venstre */}
                            <div className="col1">
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">ID</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="ID"
                                            invalid={tstate.hasError('formAsset','ID','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.ID}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Opprettet av</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="CreatedBy"
                                            invalid={tstate.hasError('formAsset','CreatedBy','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.CreatedBy}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>

                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Info ID</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="InfoID"
                                            invalid={tstate.hasError('formAsset','InfoID','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.InfoID}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>

                            
                            </div>
                        </Col>

                        { /* kolonne 2 */ }
                        <Col lg={ 4 }>

                            <div className="form-group row align-items-center">
                                <label className="col-md-4 col-form-label">Rolle</label>
                                <Col md={ 6 }>
                                    <Input type="text"
                                        name="Role"
                                        invalid={tstate.hasError('formAsset','Role','required')}
                                        onChange={tstate.validateOnChange.bind(tstate)}
                                        data-validate='["required"]'
                                        value={tstate.state.formAsset.Role}
                                    />
                                    <span className="invalid-feedback">Må fylles ut</span>
                                </Col>
                            </div>
                        
                            <div className="form-group row align-items-center">
                                <label className="col-md-4 col-form-label">Status kode</label>
                                <Col md={ 6 }>
                                    <Input type="text"
                                        name="StatusCode"
                                        invalid={tstate.hasError('formAsset','StatusCode','required')}
                                        onChange={tstate.validateOnChange.bind(tstate)}
                                        data-validate='["required"]'
                                        value={tstate.state.formAsset.StatusCode}
                                    />
                                    <span className="invalid-feedback">Må fylles ut</span>
                                </Col>
                            </div>
                        
                            <div className="form-group row align-items-center">
                            <label className="col-md-4 col-form-label">Oppdatert av</label>
                            <Col md={ 6 }>
                                <Input type="text"
                                    name="UpdatedBy"
                                    invalid={tstate.hasError('formAsset','UpdatedBy','required')}
                                    onChange={tstate.validateOnChange.bind(tstate)}
                                    data-validate='["required"]'
                                    value={tstate.state.formAsset.UpdatedBy}
                                />
                                <span className="invalid-feedback">Må fylles ut</span>
                            </Col>
                        </div>
                            
                        </Col>

                            {/* kolonne 3 */ }
                            <Col lg={ 4 }>

                            <div className="form-group row align-items-center">
                                <label className="col-md-4 col-form-label">Selskapsrelasjon</label>
                                <Col md={ 6 }>
                                    <Input type="text"
                                        name="ParentBusinessRelationID"
                                        invalid={tstate.hasError('formAsset','ParentBusinessRelationID','required')}
                                        onChange={tstate.validateOnChange.bind(tstate)}
                                        data-validate='["required"]'
                                        value={tstate.state.formAsset.ParentBusinessRelationID}
                                    />
                                    <span className="invalid-feedback">Må fylles ut</span>
                            </Col>
                        </div>

                            <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Kommentar</label>
                                    <Col md={ 6 }>
                                        <Input type="textarea"
                                            name="Comment"
                                            invalid={tstate.hasError('formAsset','Comment','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.Comment}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            </Col>
                      </Row>
                    </form>
                );
            }
        }

        if(this.state.assetId) {
        return ( 
            <span className="mr-auto"> 
                <div className="d-flex justify-content-end">
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropDown}>
                        <DropdownToggle color="link">
                            <em className="fa fa-ellipsis-v fa-lg text-muted"></em>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-right-forced animated fadeInLeft">
                            <DropdownItem onClick={this.toggleModalAsset.bind(this)}>
                                <span>Rediger</span>
                            </DropdownItem>
                            
                            <DropdownItem onClick={this.onDelete.bind(this)}>
                                <span className="text-warning">Slett kontakt</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <Modal isOpen={this.state.modalAsset} className="modal-xl" toggle={this.toggleModalAsset.bind(this)}>
                    <ModalHeader toggle={this.toggleModalAsset.bind(this)}>Kontakter</ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.modalAssetLoading, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="formAsset">Lagre</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModalAsset.bind(this)}>Avbryt</Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }else {
    return ( 
        <span className="mr-auto">
            <Button color="primary"
            style={{marginBottom: "5px", marginLeft: "5px"}}
            onClick={this.toggleModalAsset.bind(this)}>
                Opprett ny
            </Button>
            <Modal isOpen={this.state.modalAsset} className="modal-xl" toggle={this.toggleModalAsset.bind(this)}>
                <ModalHeader toggle={this.toggleModalAsset.bind(this)}>Instrument</ModalHeader>
                <ModalBody>
                    {modalForm(this.state.modalAssetLoading, this)}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" type="submit" form="formAsset">Lagre</Button>{' '}
                    <Button color="secondary" onClick={this.toggleModalAsset.bind(this)}>Avbryt</Button>
                </ModalFooter>
            </Modal>
        </span>
    );
}
}
}

