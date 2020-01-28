import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {  DB, OrgKey, firebaseFieldValue } from '../Common/firebase';
import FormValidator from '../Forms/FormValidator.js';
import swal from 'sweetalert';
import { Input,Button,Popover,PopoverHeader,PopoverBody } from 'reactstrap';


// komponent som gjør at man kan legge til egendefinerte instrument typer ved hjelp av "opprett ny type" knapp    


export default class AddCustomType extends Component {
    constructor(props) {
        super()

        this.state = {
            popoverOpen: false,
            input: "",
            pri: "",
            edit: {input: ""}
        };

        this.editRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types`);
        

        this.unsubscribeEdits = null;

        this.tableData = JSON.parse(window.localStorage.getItem("types"));
    }

    componentDidMount() {
        this.unsubscribeEdits = this.editRef.onSnapshot(this.onTypesUpdate);

    }
          
    componentWillUnmount() {
        this.unsubscribeEdits();
    }

    onTypesUpdate = (querySnapshot) => {
        let types = [];
        
        querySnapshot.forEach((doc) => {
            const typesObj = doc.data();
            typesObj.key = doc.id;
            types.push(typesObj);
        });
        this.setState({
            types,
            loadingTypes: false,
        });
    }
    
    toggle = () => this.setState({
        input: "",
        edit: {input: ""},
        popoverOpen: !this.state.popoverOpen
    })

    
    onSubmitEvent = e => {
        let hasError = false;

        if(!hasError){
            let tstate = this;
            this.setState({
                modalEditTypeLoading: true
            });

            if(this.props.view=="variants") {

            var typeId = this.props.typeId    
            DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types/${this.props.typeId}/variant`).get().then(snap => {
                var size = snap.size // will return the collection size

                let editObj = {
                    title: this.state.edit.input, // må ha samme navn som i db
                    pri: size,
                }
    
                DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types/${typeId}/variant`).doc().set(editObj).then(function() {
                    tstate.setState({
                        modalEditTypeLoading: false,
                        popoverOpen: false, 
                        edit: {input: ""}
                    });
                    
                }).catch(err => {
                    console.log(err);
                    swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error"); 
    
                    tstate.setState({
                        modalEditTypeLoading: false
                    });
                });
             });

            }else {
                 
                    DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types`).get().then(snap => {
                        var size = snap.size // will return the collection size
        
                        let editObj = {
                            title: this.state.edit.input, // må ha samme navn som i db
                            pri: size,
                        }
            
                        DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types`).doc().set(editObj).then(function() {
                            tstate.setState({
                                modalEditTypeLoading: false,
                                popoverOpen: false,
                                edit: {input: ""}
                            });

                        }).catch(err => {
                            console.log(err);
                            swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error"); 
            
                            tstate.setState({
                                modalEditTypeLoading: false
                            });
                        });
                     });
            }
        }
        e.preventDefault();

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

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return  this.state[formName] &&
                this.state[formName].errors &&
                this.state[formName].errors[inputName] &&
                this.state[formName].errors[inputName][method]
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
                    return <form onSubmit={tstate.onSubmitEvent.bind(tstate)} name="edit" id="edit">
                        <div className="form-group row align-items-center">
                                    <label className="col-md-6 col-form-label">Nytt instrument</label>
                                        <Input type="text"
                                            name="input"
                                            invalid={tstate.hasError('edit','edit','required')}
                                            onChange={tstate.validateOnChange.bind(tstate)}
                                            data-validate='["required"]'
                                            value={tstate.state.edit.input}
                                        />
                                        <span className="invalid-feedback">Må fylles ut</span>
                                </div>
                        </form>;
        }
    }
            if(this.props.view=="variants") {
            return (
                <span>
                    <Button className="mr-1" color="primary" id={'Popover-' + this.props.id} onClick={this.toggle.bind(this)}
                    style={{marginBottom: "5px", marginLeft: "5px"}}>Opprett ny variant</Button>
                    <Popover placement="top" isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle.bind}>
                        <PopoverHeader>Legg til egendefinert type</PopoverHeader>
                        <PopoverBody>
                            {modalForm(this.state.modalEditTypeLoading, this)}
                            <Button color="primary" size="xs" type="submit" form="input" onClick={this.onSubmitEvent.bind(this)}>Lagre</Button>{' '}
                            <Button color="secondary" size="xs" onClick={this.toggle.bind(this)}>Avbryt</Button>
                        </PopoverBody>
                    </Popover>
                </span>
            )
            }
            else {
                return (
                    <span>
                        <Button className="mr-1" color="primary" id={'Popover-' + this.props.id} onClick={this.toggle.bind(this)}
                        style={{marginBottom: "5px", marginLeft: "5px"}}>Opprett ny type</Button>
                        <Popover placement="top" isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle.bind}>
                            <PopoverHeader>Legg til egendefinert type</PopoverHeader>
                            <PopoverBody>
                                {modalForm(this.state.modalEditTypeLoading, this)}
                                <Button color="primary" size="xs" type="submit" form="input" onClick={this.onSubmitEvent.bind(this)}>Lagre</Button>{' '}
                                <Button color="secondary" size="xs" onClick={this.toggle.bind(this)}>Avbryt</Button>
                            </PopoverBody>
                        </Popover>
                    </span>
                )
            }
    }
}



