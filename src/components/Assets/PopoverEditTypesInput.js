import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {  DB, OrgKey, firebaseFieldValue } from '../Common/firebase';
import FormValidator from '../Forms/FormValidator.js';
import swal from 'sweetalert';
import { Input,Button,Popover,PopoverHeader,PopoverBody } from 'reactstrap';


// komponent som åpner eit popover vindu, som du kan redigere typer i "drag drop typeslist"

export default class PopoverEditTypesInput extends Component {
    constructor(props) {
        super()

        this.typeRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types/${props.typeId}`)
        this.variantRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types/${props.typeId}/variant/${props.variantId}`);
        
        this.unsubscribeType = null;
        this.unsubscribeVariant = null;

        this.state = {
            popoverOpen: false,
            typeId: props.typeId,
            variantId: props.variantId,
            types: {
                title: "",
                pri: 0
            }
        }
    }

    componentDidMount() {
        if(this.state.variantId) {
            this.unsubscribeVariant = this.variantRef.onSnapshot(this.onTypeUpdate);
        }else {
            this.unsubscribeType = this.typeRef.onSnapshot(this.onTypeUpdate);
        }
    }

    componentWillUnmount() {
        if(this.state.variantId) {
            this.unsubscribeVariant();
            
        }else {
            this.unsubscribeType();
        }
    }
          
    onSubmitEvent = e => {

            if(this.state.variantId) {
                const form = e.target;
                let hasError = false;
        
                if(!hasError){
                    let tstate = this;
                    this.setState({
                        EditModalLoading: true
                    });

                let typeObj = {
                    title: this.state.types.title,
                    pri: this.state.types.pri
                }
                
                
                DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types/${this.state.typeId}/variant`).doc(this.state.variantId).set(typeObj).then(function() {
                    tstate.setState({
                        EditModalLoading: false,
                        popoverOpen: false
                    });
                }).catch(err => {
                    console.log(err);
                    swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");
    
                    tstate.setState({
                        EditModalLoading: false
                    });
                });
            };
            
            }else {
                    const form = e.target;
                    let hasError = false;
            
                    if(!hasError){
                        let tstate = this;
                        this.setState({
                            EditModalLoading: true
                        });
    
                    let typeObj = {
                        title: this.state.types.title,
                        pri: this.state.types.pri
                    }
        
                    DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types`).doc(this.state.typeId).set(typeObj).then(function() {
                        tstate.setState({
                            EditModalLoading: false,
                            popoverOpen: false
                        });
                    }).catch(err => {
                        console.log(err);
                        swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");
        
                        tstate.setState({
                            EditModalLoading: false
                        });
                    });
                }

            }
        e.preventDefault();
    }

    hasError = (formName, inputName, method) => {
        return  this.state[formName] &&
                this.state[formName].errors &&
                this.state[formName].errors[inputName] &&
                this.state[formName].errors[inputName][method]
    }

    onDeleteBtn = () => {

                DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types`).doc(this.state.typeId).delete().then(function() {
                    console.log("suksess")
                })
             }
        
    
    onTypeUpdate = querySnapshot => {
        let typeObj = querySnapshot.data();
        if(querySnapshot.exists) {
            this.setState({
                types: typeObj,
            }); 
        }
    }

    validateOnChange = event => {
        const input = event.target;
        const form = input.form;
        const value = input.title === 'checkbox' ? input.checked : input.value;

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

    toggleEditModal = prevState => {
        if(this.state.typeId) {
        this.setState({
            typeId: this.state.typeId,
            popoverOpen: !this.state.popoverOpen
        });
    }else {
        this.setState({
            variantId: this.state.variantId,
            popoverOpen: !this.state.popoverOpen
        });
    }
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
                    if(tstate.state.variantId) {
                    return <form onSubmit={tstate.onSubmitEvent.bind(tstate)} name="types" id="types">
                        <div className="form-group row align-items-center">
                                    <label className="col-md-6 col-form-label">Rediger variant</label>
                                        <Input title="text"
                                            name="title"
                                            invalid={tstate.hasError('title','title','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.types.title}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                </div>
                        </form>;
        }else {
            
                return <form onSubmit={tstate.onSubmitEvent.bind(tstate)} name="types" id="types">
                    <div className="form-group row align-items-center">
                                <label className="col-md-6 col-form-label">Rediger typer</label>
                                    <Input title="text"
                                        name="title"
                                        invalid={tstate.hasError('title','title','required')}
                                        onChange={tstate.validateOnChange.bind(tstate)}
                                        data-validate='["required"]'
                                        value={tstate.state.types.title}
                                    />
                                    <span className="invalid-feedback">Må fylles ut</span>
                            </div>
                    </form>;
    }
    }
    }

        return (
            <span style={{float:"right"}}>
                <Button  className="mr-1" color="link" id={'Popover-' + this.state.typeId} onClick={this.toggleEditModal.bind(this)}>Rediger</Button>
                <Popover placement="right" isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggleEditModal.bind}>
                    <PopoverHeader>Legg til egendefinert title</PopoverHeader>
                    <PopoverBody>
                        {modalForm(this.state.EditModalLoading, this)}
                        <Button color="primary" size="xs" title="submit" form="type_input" onClick={this.onSubmitEvent.bind(this)}>Lagre</Button>{' '}
                        <Button color="secondary" size="xs" onClick={this.toggleEditModal.bind(this)}>Avbryt</Button>
                        {/*<Button color="secondary" size="xs" onClick={this.onDeleteBtn}>Slett</Button>*/}
                    </PopoverBody>
                </Popover>
            </span>
        )
    }


    
}