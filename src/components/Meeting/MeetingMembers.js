import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import MeetingMember from './MeetingMember';
import SelectMembersModal from '../Members/SelectMembersModal'

import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import ScrollArea from 'react-scrollbar';

export default class MeetingMembers extends Component {
    constructor(props, context) {
        super();

        this.meetingPersonsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${props.meetingId}/members`);
        
        this.unsubscribeMeetingMembers = null;
        
        this.state = {
            loadingMeetingMembers: true,
            members: [
            ],
            dropdownPersonsOpen: false,
            memberStep: 0,
            memberId: "",
            selectMemberOpen: false
        };
    }

    componentDidMount() {
        this.unsubscribeMeetingMembers = this.meetingPersonsRef.orderBy("created", "asc").onSnapshot(this.onMeetingMembersUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeMeetingMembers();
    }

    onMeetingMembersUpdate = (querySnapshot) => {
        let members = [];
      
        querySnapshot.forEach((doc) => {
          const memberObj = doc.data();
          memberObj.key = doc.id;
          members.push(memberObj);
        });

        this.setState({ 
            members,
            loadingMeetingMembers: false,
        });
    }

    displayMembers() {
        this.setState({
            memberStep: 0,
            memberId: ""
        });
    }

    openMember(state, memberId, event) {
        state.setState({
            memberStep: 1
        });
        setTimeout(function(){
            state.setState({
                memberStep: 2,
                memberId: memberId
            });
        }, 10);
    }

    togglePersonsDD() {
        this.setState({
            dropdownPersonsOpen: !this.state.dropdownPersonsOpen
        });
    }

    openSelectMember() {
        this.setState({
            selectMemberOpen: true
        });
    }

    render() {
        function members(loading, members, state, onClick){
            if(loading){
                return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                let membersList = members.map((memberObj, index) => {
                    return <MeetingMember key={index} memberObj={memberObj} meetingId={state.props.meetingId}></MeetingMember>;
                });
                return membersList;
            }
        }

        if(this.state.loadingMeetingMembers){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                <div></div>
                <div></div>
                <div></div>
            </div>;
        } else if(this.state.members.length === 0){
            return (
                <div>
                    <div className="card-header">
                        <SelectMembersModal meetingId={this.props.meetingId}></SelectMembersModal>

                        <div className="card-title"><h4><Trans i18nKey='components.meetings.MEETING_MEMBERS'></Trans></h4></div>
                    </div>
                    
                    <div>
                        <div><p><Trans i18nKey='components.meetings.MEETING_MEMBERS_EMPTY'></Trans></p></div>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="card-header">
                        <SelectMembersModal meetingId={this.props.meetingId}></SelectMembersModal>
                        
                        <div className="card-title"><h4><Trans i18nKey='components.meetings.MEETING_MEMBERS'></Trans></h4></div>
                    </div>

                    <div className="card-body" style={{ minHeight: "500px" }}>
                        {members(this.state.loadingMembers, this.state.members, this, this.openMember)}
                    </div>
                </div>
            );
        }
    }
}
