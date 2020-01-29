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

export default class SettingsModal extends Component {
    constructor(props) {
        super()

        this.assetRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items/${props.itemId}`)

        this.state = {
            settingsModal: false,
            loadingAsset: true,
            asset: {},
            dropdownOpen: false
        };

    }

    componentDidMount() {
        this.unsubscribeAsset = this.assetRef.onSnapshot(this.onAssetUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeAsset();
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

    toggleSettingsModal () {
        this.setState(prevState => ({
            settingsModal: !prevState.settingsModal
        }));
    }

    render() {
        function modalForm(loading, state) 
        {
            if(loading){
                return <div className="ball-moda" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                return (
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
                )
            }
        }

        return(
            

            <div>
            <Modal isOpen={this.state.settingsModal} className="modal-l" toggle={this.toggleSettingsModal.bind(this)}>
                <ModalHeader toggle={this.toggleSettingsModal.bind(this)}>
                    Innstillinger
                </ModalHeader>
                <ModalBody>
                    {modalForm(this.state.loadingAsset, this)}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.toggleSettingsModal.bind(this)}>Lukk</Button>
                </ModalFooter>
            </Modal>
        </div>
        );
    }
}