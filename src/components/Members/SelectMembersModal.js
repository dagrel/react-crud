import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Select from 'react-select';
import swal from 'sweetalert';
import $ from 'jquery';

import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

export default class SelectMemberModal extends Component {
    constructor(props, context) {
        super();

        this.membersRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/persons`);

        this.state = {
            meetingId: props.meetingId,
            modalMembers: false,
            modalMembersLoading: false,
            modalInvite: false,
            activeMembers: [
                
            ],
            formMember: {
                members: []
            },
            selectMemberOpen: false
        };
    }

    componentDidMount() {
        this.unsubscribeMembers = this.membersRef.orderBy("first_name", "asc").onSnapshot(this.onMembersUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeMembers();
    }

    onMembersUpdate = (querySnapshot) => {
        let activeMembers = [];
      
        querySnapshot.forEach((doc) => {
            const memberObj = {
                value: doc.id,
                label: `${doc.data().first_name} ${doc.data().last_name}`
            };
            activeMembers.push(memberObj);
        });

        console.log(activeMembers);

        this.setState({ 
            activeMembers
        });
    }

    validateOnChange = event => {
        this.setState({
            formMember: {
                members: event,
            }
        });
    }

    onSubmitMember = e => {
        let members = this.state.formMember.members;
        
        if(members.length){
            let tstate = this;

            this.setState({
                modalMembersLoading: true
            });

            let submitBatch = DB.batch();

            members.forEach(member => {
                let meetingMemberObj = {
                    added_by: "Person Navn",
                    attended: false,
                    created: firebaseTimestamp.fromDate(new Date()),
                    person: DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/persons/${member.value}`),
                    title: member.label
                }
    
                let meetingMemberRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${tstate.state.meetingId}/members`).doc();
                submitBatch.set(meetingMemberRef, meetingMemberObj);
            });
            
            submitBatch.commit().then(function () {
                swal("Ok", "Deltakere har blitt lagt til", "success");

                tstate.setState({
                    modalMembersLoading: false,
                    modalMembers: false,
                    formMember: {
                        members: []
                    }
                });
            }).catch(err => {
                console.log(err);
                swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");

                tstate.setState({
                    modalMembersLoading: false
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

    togglePersonsDD() {
        this.setState({
            dropdownPersonsOpen: !this.state.dropdownPersonsOpen
        });
    }

    toggleModalMembers() {
        this.setState(prevState => ({
          modalMembers: !prevState.modalMembers
        }));
    }

    toggleModalInvite() {
        this.setState(prevState => ({
          modalInvite: !prevState.modalInvite
        }));
    }

    submitModalInvite() {
        /*
        this.setState(prevState => ({
          modalInvite: !prevState.modalInvite
        }));
        */
        let orgId = window.localStorage.getItem(OrgKey);
        let meetingId = this.state.meetingId;

       var formData = {"orgId": orgId, "meetingId": meetingId};

        $.ajax({
           
            //url : "http://localhost:5000/styreportalenv2b/us-central1/sendMeetingInvitation",
            url : "https://us-central1-styreportalenv2b.cloudfunctions.net/sendMeetingInvitation",
            type: "POST",
            data : formData,
            success: function(tokendata, textStatus, jqXHR)
            {
                //state.setState({fileLoading: false});
                //swal("OK", "Filen er blit splittet og lastet opp", "success");
                //window.location.href = "/notearkiv";
                console.log("sendt innkalling");
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                //state.setState({fileLoading: false});
                //swal("Feil", "En feil har oppstått, vennligst prøv igjen senere", "error");
            }
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
                return <form onSubmit={tstate.onSubmitMember.bind(tstate)} action="" name="formMember" id="formMember">
                            <fieldset>
                                <div className="form-group row align-items-center">
                                    <label className="col-md-4 col-form-label"><Trans i18nKey='components.members_modal.SELECT_MEMBERS'></Trans></label>
                                    <Col md={ 8 }>
                                        <Select
                                            name="member"
                                            invalid={tstate.hasError('formMember','member','required')}
                                            options={tstate.state.activeMembers}
                                            onChange={tstate.validateOnChange.bind(tstate)}
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
                <Dropdown className="float-right" isOpen={this.state.dropdownPersonsOpen} toggle={this.togglePersonsDD.bind(this)}>
                    <DropdownToggle className="icon-options">
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={this.toggleModalMembers.bind(this)}><Trans i18nKey='components.members_modal.ADD_MEMBERS'></Trans></DropdownItem>
                        <DropdownItem onClick={this.toggleModalInvite.bind(this)}><Trans i18nKey='components.members_modal.SEND_INVITATION'></Trans></DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <Modal isOpen={this.state.modalMembers} toggle={this.toggleModalMembers.bind(this)}>
                    <ModalHeader toggle={this.toggleModalMembers.bind(this)}><Trans i18nKey='components.members.MEMBERS'></Trans></ModalHeader>
                    <ModalBody>
                        {modalForm(this.state.modalMembersLoading, this)}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit" form="formMember"><Trans i18nKey='components.members_modal.SELECT_MEMBERS'></Trans></Button>{' '}
                        <Button color="secondary" onClick={this.toggleModalMembers.bind(this)}><Trans i18nKey='utility.CANCEL_BUTTON'></Trans></Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.modalInvite} toggle={this.toggleModalInvite.bind(this)}>
                    <ModalHeader toggle={this.toggleModalInvite.bind(this)}><Trans i18nKey='components.members_modal.SEND_INVITATION'></Trans></ModalHeader>
                    <ModalBody>
                        <p><Trans i18nKey='components.members_modal.SEND_INVITATION_CONFIRM'></Trans></p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitModalInvite.bind(this)}><Trans i18nKey='components.members_modal.SEND_INVITATION'></Trans></Button>{' '}
                        <Button color="secondary" onClick={this.toggleModalInvite.bind(this)}><Trans i18nKey='utility.CANCEL_BUTTON'></Trans></Button>
                    </ModalFooter>
                </Modal>
            </span>
        );
    }
}
