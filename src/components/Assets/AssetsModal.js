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

        this.assetRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items/${props.itemId}`)
        this.typesRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types`)

        this.unsubscribeAsset = null;
        this.unsubscribeTypes = null;
        
        this.state = {
            assetId: props.itemId,
            modalAsset: false,
            formAsset: {
                title: '',
                brand: "",
                serialnumber: "",
                description_long: "",
                description_technical: "",
                date_scrapped: moment(new Date()),
                date_bought: moment(new Date()),
                number: 0,
                type: "",
                variant: "",
                current_value: "",
                original_price: "",
                deleted: false
            },

            
            intial_choice_array: [], // ddown 1
            second_choice_array: [], // ddown 2
        };
    }

    componentDidMount()  {
        this.unsubscribeAsset = this.assetRef.onSnapshot(this.onAssetUpdate);
        this.unsubscribeTypes = this.typesRef.onSnapshot(this.onTypesUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeAsset();
        this.unsubscribeTypes();
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

    // funksjon for valg av kjøpsdato
    dateBoughtOnChange = value => {
        let formData = this.state.formAsset;
        formData.date_bought = value;
        this.setState({
            formEvent: formData
        });
    }

    // funksjon for valg av kondemnert dato
    dateScrappedOnChange = value => {
        let formData = this.state.formAsset;
        formData.date_scrapped = value;
        this.setState({
            formEvent: formData
        });
    }

    ChoiceOnChange = value => {
        var tstate = this;
        var variantRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types/${value.value}/variant`);
        variantRef.get().then(function(querySnapshot) {
            let variant = [];
        
            querySnapshot.forEach((doc) => {
              
              var variantObj = doc.data();
              var dropDownType = {label: variantObj.title, value: doc.id}
              variantObj.label = doc.data().title;
              variantObj.value = doc.id
              variantObj.key = doc.id;
              variant.push(dropDownType);
            });
          tstate.setState({
              second_choice_array: variant
          })});
        let formAsset = this.state.formAsset;
        formAsset.type = value.value;
        formAsset.type_label = value.label;
        tstate.setState({
            formAsset: formAsset
        });
    }

    variantOnChange = value => {
        var tstate = this;

        let formAsset = this.state.formAsset;
        formAsset.variant = value.value;
        formAsset.variant_label = value.label;
        tstate.setState({
            formAsset: formAsset
        });
    }

    onAssetUpdate = (querySnapshot) => {
        let assetObj = querySnapshot.data();
        if(querySnapshot.exists) {
            if(assetObj.date_scrapped) {
                assetObj.date_scrapped = moment(assetObj.date_scrapped.toDate()).format("DD.MM.YYYY");
             } 
             if(assetObj.date_bought) {
                assetObj.date_bought = moment(assetObj.date_bought.toDate()).format("DD.MM.YYYY");
             }
             
            this.setState({
                asset: assetObj,
            }); 
        }
    }

    onTypesUpdate = (querySnapshot) => {
        let types = [];
        
          querySnapshot.forEach((doc) => {
            
            var typesObj = doc.data();
            var dropDownType = {label: typesObj.title, value: doc.id}
            typesObj.label = doc.data().title;
            typesObj.value = doc.id
            typesObj.key = doc.id;
            types.push(dropDownType);
          });
        this.setState({
            types,
            intial_choice_array: types
        });
    }

    onDelete = () => {
        let deleted = this.state.formAsset.deleted;
        this.setState({
            
        });
    }
    
    onSubmitEvent = e => {
        const form = e.target;
        let hasError = false;
        var date_scrapped = "";
        var date_bought = "";

        if(!hasError){
            if(this.state.formAsset.date_scrapped) {
                date_scrapped = firebaseTimestamp.fromDate(moment(this.state.formAsset.date_scrapped, "YYYY.MM.DD").toDate())
            }

            if(this.state.formAsset.date_bought) {
                date_bought = firebaseTimestamp.fromDate(moment(this.state.formAsset.date_bought, "YYYY.MM.DD").toDate())
            }

            if(this.state.formAsset.title) {
                let tstate = this;
                this.setState({
                    modalAssetLoading: true
            });

            let assetObj = {
                title: this.state.formAsset.title,
                brand: this.state.formAsset.brand,
                serialnumber: this.state.formAsset.serialnumber,
                description_long: this.state.formAsset.description_long,
                description_technical: this.state.formAsset.description_technical,
                date_scrapped: date_scrapped,
                date_bought: date_bought,
                // number
                type: this.state.formAsset.type,
                type_label: this.state.formAsset.type_label,
                variant: this.state.formAsset.variant,
                variant_label: this.state.formAsset.variant_label,
                current_value: this.state.formAsset.current_value,
                original_price: this.state.formAsset.original_price,
                created: firebaseTimestamp.fromDate(new Date()),
                altered: firebaseTimestamp.fromDate(new Date()),
            }
            if (this.state.assetId) {
            DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items`).doc(this.state.assetId).set(assetObj).then(function() {
               

                tstate.setState({
                    modalAssetLoading: false,
                    modalAsset: false,
                    formAsset: {
                        title: '',
                        brand: "",
                        serialnumber: "",
                        description_long: "",
                        description_technical: "",
                        date_scrapped: "",
                        date_bought: "",
                       // number: "",
                        type: "",
                        type_label: "",
                        variant: "",
                        variant_label: "",
                        current_value: "",
                        original_price: ""
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
            DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items`).doc().set(assetObj).then(function() {

                tstate.setState({
                    modalAssetLoading: false,
                    modalAsset: false,
                    formAsset: {
                        title: '',
                        brand: "",
                        serialnumber: "",
                        description_long: "",
                        description_technical: "",
                        date_scrapped: "",
                        date_bought: "",
                       // number: "",
                        type: "",
                        type_label: "",
                        variant: "",
                        variant_label: "",
                        current_value: "",
                        original_price: ""
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
                    title: this.state.asset.title,
                    brand: this.state.asset.brand,
                    serialnumber: this.state.asset.serialnumber,
                    description_long: this.state.asset.description_long,
                    description_technical: this.state.asset.description_technical,
                    date_scrapped: this.state.asset.date_scrapped,
                    date_bought: this.state.asset.date_bought,
                    //number: 
                    type: this.state.asset.type,
                    type_label: this.state.asset.type_label,
                    variant: this.state.asset.variant,
                    variant_label: this.state.asset.variant_label,
                    current_value: this.state.asset.current_value,
                    original_price: this.state.asset.original_price
                },
                modalAsset: !prevState.modalAsset
            }));
        } else {
        this.setState(prevState => ({
            formAsset: {
                title: '',
                brand: "",
                serialnumber: "",
                description_long: "",
                description_technical: "",
                date_scrapped: "",
                date_bought: "",
                //number: "",
                type: "",
                variant: "",
                current_value: "",
                original_price: ""
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
                                    <label className="col-md-4 col-form-label">Tittel</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="title"
                                            invalid={tstate.hasError('formAsset','title','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.title}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Merke</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="brand"
                                            invalid={tstate.hasError('formAsset','brand','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.brand}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>

                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Serienummer</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="serialnumber"
                                            invalid={tstate.hasError('formAsset','serialnumber','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.serialnumber}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>

                            <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Beskrivelse</label>
                                    <Col md={ 6 }>
                                        <Input type="textarea"
                                            name="description_long"
                                            invalid={tstate.hasError('formAsset','description_long','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.description_long}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Teknisk beskrivelse</label>
                                    <Col md={ 6 }>
                                        <Input type="textarea"
                                            name="description_technical"
                                            invalid={tstate.hasError('formAsset','description_technical','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.description_technical}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            </div>
                        </Col>

                        { /* kolonne 2 */ }
                        <Col lg={ 4 }>
                                
                                    <div className="form-group row align-items-center">
                                        <label className="col-md-4 col-form-label">Verdi</label>
                                        <Col md={ 6 }>
                                            <Input type="text"
                                                name="current_value"
                                                invalid={tstate.hasError('formAsset','current_value','required')}
                                                onChange={tstate.validateOnChange.bind(tstate)}
                                                data-validate='["required"]'
                                                value={tstate.state.formAsset.current_value}
                                            />
                                            <span className="invalid-feedback">Må fylles ut</span>
                                        </Col>
                                    </div>
                                
                                    <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Original pris</label>
                                    <Col md={ 6 }>
                                        <Input type="text"
                                            name="original_price"
                                            invalid={tstate.hasError('formAsset','original_price','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.formAsset.original_price}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>
                            
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label">Dato kjøpt</label>
                                        <Col md={ 6 }>
                                        <Datetime
                                            inputProps={{ name: 'date_bought' }}
                                            onChange={tstate.dateBoughtOnChange.bind(tstate)}
                                            value={tstate.state.formAsset.date_bought}
                                            locale="nb"
                                            dateFormat="DD.MM.YYYY" timeFormat={false}
                                            />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                        </Col>
                                </div>
                            
                        </Col>

                            {/* kolonne 3 */ }
                            <Col lg={ 4 }>

                            <div className="form-group row align-items-center">
                                    <label className="col-md-5 col-form-label">Dato kondemnert</label>
                                    <Col md={ 6 }>
                                        <Datetime 
                                            inputProps={{ name: 'date_scrapped' }}
                                            onChange={tstate.dateScrappedOnChange.bind(tstate)}
                                            value={tstate.state.formAsset.date_scrapped}
                                            locale="nb"
                                            dateFormat="DD.MM.YYYY" timeFormat={false}
                                            />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                        </Col>
                                </div>

                                <div className="form-group row align-items-center">
                                    <label className="col-md-5 col-form-label">Instrument type</label>
                                    <Col md={ 6 }>
                                        <Select
                                            name="type" // må ta inn her
                                            invalid={tstate.hasError('formAsset','type','required')}
                                            onChange={tstate.ChoiceOnChange.bind(tstate)} 
                                            data-validate='["required"]'
                                            isMulti={false}
                                            options={tstate.state.intial_choice_array}
                                            value={{label: tstate.state.formAsset.type_label, value: tstate.state.formAsset.type}}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                    </Col>
                                </div>

                                <div className="form-group row align-items-center">
                                    <label className="col-md-5 col-form-label">Instrument variant</label>
                                    <Col md={ 6 }>
                                        <Select
                                            name="variant"
                                            invalid={tstate.hasError('formAsset','variant','required')}
                                            onChange={tstate.variantOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            isMulti={false}
                                            options={tstate.state.second_choice_array}
                                            value={{label: tstate.state.formAsset.variant_label, value: tstate.state.formAsset.variant}}
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
                            
                            <DropdownItem>
                                <span className="text-warning">Slett instrument</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
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

