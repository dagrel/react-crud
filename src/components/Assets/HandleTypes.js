import React, { Component } from 'react';
import { Col,Row, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import ContentWrapper from '../Layout/ContentWrapper';
import { ListGroup, ListGroupItem } from 'reactstrap';
import sortable from 'html5sortable/dist/html5sortable.es.js';
import 'react-datetime/css/react-datetime.css';
import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';
import AddCustomType from "./AddCustomType"
import PopoverEditTypesInput from "./PopoverEditTypesInput"
import DragDropTypesList from "./DragDropTypesList"


export default class HandleTypes extends Component {
    constructor(props) {
        super();

        this.typesRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types`);
        this.assetRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items/${props.itemId}`)
        
        this.unsubscribeTypes = null;
        this.unsubscribeAsset = null;

        this.tableData = JSON.parse(window.localStorage.getItem("types"));

        this.state = {
            TypesModal: false,
            type: "",
            intial_choice_array: [], // ddown 1
            second_choice_array: [], // ddown 2
            formData: {type:0},
            settingsModal: false,
            loadingAsset: true,
            asset: {}
        };
    }

    componentDidMount() {
        this.unsubscribeTypes = this.typesRef.onSnapshot(this.onTypesUpdate);
        this.unsubscribeAsset = this.assetRef.onSnapshot(this.onAssetUpdate);
      }
      
      componentWillUnmount() {
          this.unsubscribeTypes();
          this.unsubscribeAsset();
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

    onAssetUpdate = (querySnapshot) => {
        let assetObj = querySnapshot.data();
        if(querySnapshot.exists) {

            this.setState({
                asset: assetObj,
                loadingAsset: false,
            }); 
        }
    }

    ChoiceOnChange = value => {
        var tstate = this;
        this.setState ({
            formData: {type:0}
        })
        var variantRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types/${value.value}/variant`);
        variantRef.get().then(function(querySnapshot) {
            let variants = [];
        
            querySnapshot.forEach((doc) => {
              
              var variantObj = doc.data();
              var dropDownType = {label: variantObj.title, value: doc.id}
              variantObj.label = doc.data().title;
              variantObj.value = doc.id
              variantObj.key = doc.id;
              variants.push(dropDownType);
            });
            let formData = tstate.state;
            formData.type = value.value;

          tstate.setState({
              variants,
              formData
          })});
    }
      
      ToggleTypesModal() {
        this.setState(prevState => ({
            TypesModal: !prevState.TypesModal,
            type: ""
        }));
    }

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    toggleSettingsModal () {
        this.setState(prevState => ({
            settingsModal: !prevState.settingsModal,
        }));
    }

render() {

    function settingsForm(loading,state) {
        if(loading){
            return <div className="ball-moda" style={{ textAlign: 'center' }}>
                <div></div>
                <div></div>
                <div></div>
            </div>;
        }else {
            return (
                <span>
                    <div className="card card-default" >
                        <div className="card-header">
                            <div className="card-title text-center">Nummer</div>
                        </div>
                        <div className="card-body">
                            
                            <div className="card-body">
                            Neste nummer???: 
                            </div>

                        </div>
                    </div>
                </span>
            );}
        }
    
    function modalForm(loading, tstate)
    {
        if(loading){
            return <div className="ball-moda" style={{ textAlign: 'center' }}>
                <div></div>
                <div></div>
                <div></div>
            </div>;
        } else {
            if(tstate.state.formData.type) {
            return (
                <div >
                    <Row >
                    <Col md="6">
                    <div className="form-group row align-items-center">
                        <label className="col-md-8 col-form-label">Instrument type</label>
                        <Col md={ 12 }>
                            <Select
                                name="type"
                                onChange={tstate.ChoiceOnChange.bind(tstate)} 
                                data-validate='["required"]'
                                isMulti={false}
                                options={tstate.state.intial_choice_array}
                            />
                            <span className="invalid-feedback">Må fylles ut</span>
                        </Col>
                        
                    </div>
                    </Col>
                    <Col md="6">
                        <DragDropTypesList />
                    </Col>
                    
                    </Row>
                    <DragDropTypesList view={"variants"} typeId={tstate.state.formData.type} />
                </div> 
            )
            }else {
                return (
                    <div>
                    <Row >
                    <Col md="6">
                    <div className="form-group row align-items-center">
                        <label className="col-md-8 col-form-label">Instrument type</label>
                        <Col md={ 12 }>
                            <Select
                                name="type"
                                onChange={tstate.ChoiceOnChange.bind(tstate)} 
                                data-validate='["required"]'
                                isMulti={false}
                                options={tstate.state.intial_choice_array}
                            />
                            <span className="invalid-feedback">Må fylles ut</span>
                        </Col>
                    </div>
                </Col>
                    
                    <Col md="6">
                        <DragDropTypesList />
                    </Col>
                    
            </Row>
        </div>
                )
            }
        }    
    }
        return (    
        <span>
            <div className="d-flex justify-content-end "
               marginBottom="40px">
                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle color="link">
                            <em className="fa fa-ellipsis-v fa-lg text-muted"></em>
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-right-forced animated fadeInLeft">
                            <DropdownItem onClick={this.ToggleTypesModal.bind(this)}>
                                <span>Rediger type</span>
                            </DropdownItem>
                            
                            <DropdownItem onClick={this.toggleSettingsModal.bind(this)}>
                                <span >Innstillinger</span>
                            </DropdownItem>

                        </DropdownMenu>
                    </Dropdown>
            </div>

            <div>
            <Modal isOpen={this.state.settingsModal} className="modal-l" toggle={this.toggleSettingsModal.bind(this)}>
                <ModalHeader toggle={this.toggleSettingsModal.bind(this)}>
                    Innstillinger
                </ModalHeader>
                <ModalBody>
                    {settingsForm()}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggleSettingsModal.bind(this)}>Lukk</Button>
                </ModalFooter>
            </Modal>
            </div>

            <Modal isOpen={this.state.TypesModal} className="modal-m" toggle={this.ToggleTypesModal.bind(this)}>
                <ModalHeader toggle={this.ToggleTypesModal.bind(this)}>
                    Rediger instrument varianter
                </ModalHeader>
                <ModalBody>
                    {modalForm(this.state.typesModalLoading, this)}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.ToggleTypesModal.bind(this)}>Lukk</Button>
                </ModalFooter>
            </Modal>
        </span>  
        );
    }
}
