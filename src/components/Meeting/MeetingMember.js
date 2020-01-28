import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Router, Route, Link } from 'react-router-dom';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledTooltip, Progress, Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import classNames from 'classnames';
import $ from 'jquery';

import { firebaseTimestamp, firebaseFieldValue, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

export default class Member extends Component {
    constructor(props, context) {
        super();

        this.meetingMemberRef = props.memberObj.member;

        this.unsubscribeMeetingMember = null;
        
        this.state = {
            loadingMeetingMember: false,
            member: {
                created: firebaseTimestamp.fromDate(new Date())
            },
            dropdownMemberOpen: false
        };
    }

    componentDidMount() {
        //this.unsubscribeMeetingMember = this.meetingMemberRef.onSnapshot(this.onMeetingMemberUpdate);
    }
    
    componentWillUnmount() {
        //this.unsubscribeMeetingMember();
    }

    onMeetingMemberUpdate = (memberSnapshot) => {
        this.setState({ 
            member: memberSnapshot.data(),
            loadingMeetingMember: false,
        });
    }
    
    toggleMemberDD() {
        this.setState({
            dropdownMemberOpen: !this.state.dropdownMemberOpen
        });
    }

    toggleAttended() {
        let tstate = this;

        /*
        console.log(this.props.memberObj);
        console.log(attended);
        console.log(this.props.meetingId);
        console.log(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${this.props.meetingId}/members/${this.props.memberObj.key}`);
        */
        
        let meetingMemberRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${this.props.meetingId}/members/${this.props.memberObj.key}`);
        let submitBatch = DB.batch();

        let meetingMemberObj = this.props.memberObj;
        meetingMemberObj.attended = !this.props.memberObj.attended;
        meetingMemberObj.key = firebaseFieldValue.delete();

        submitBatch.update(meetingMemberRef, meetingMemberObj);

        submitBatch.commit().then(function () {
            tstate.setState({
                dropdownMemberOpen: false
            });
        }).catch(err => {
            console.log(err);

            tstate.setState({
                dropdownMemberOpen: false
            });
        });
    }

    sendInvite() {
        let orgId = window.localStorage.getItem(OrgKey);
        let meetingId = this.state.meetingId;

        var formData = {"orgId": orgId, "meetingId": this.props.meetingId, "memberId": this.props.memberObj.key};

        console.log(formData);
        
        /*
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
        */
    }

    render() {
        //<Link to={`/sak/${this.props.memberObj.key}`} style={{ textDecoration: 'none' }}></Link>
        let meetingColor = ["#edf000", "#000edf"];

        var attendedClasses = classNames(
            'align-self-start',
            'mx-2 circle',
            'thumb32',
            'text-center',
            {
              'bg-success': this.props.memberObj.attended
            }
        );

        var attendingClasses = classNames(
            'fa-2x',
            'icon-info',
            'mr-2',
            {
              'text-success': this.props.memberObj.attending,
              'text-danger': (this.props.memberObj.attending !== undefined && !this.props.memberObj.attending)
            }
        );

        function sentStatus(mail_sent){
            if(mail_sent){
                return(<span className="text-success">{moment(mail_sent.toDate()).format("DD.MM.YYYY")}</span>);
            } else {
                return(<span className="text-danger"><em className="fa mr-2 fas fa-times"></em></span>);
            }
        }

        function openedStatus(mail_opened){
            if(mail_opened){
                return(<span className="text-success">{moment(mail_opened.toDate()).format("DD.MM.YYYY")}</span>);
            } else {
                return(<span className="text-danger"><em className="fa mr-2 fas fa-times"></em></span>);
            }
        }

        function attendingStatus(attending){
            if(attending){
                return(<span className="text-success"><Trans i18nKey='components.meetings.ATTENDING'></Trans></span>);
            } else if(attending === undefined){
                return(<span className="text-warning"><em className="fa mr-2 fas fa-question"></em></span>);
            } else {
                return(<span className="text-danger"><Trans i18nKey='components.meetings.NOT_ATTENDING'></Trans></span>);
            }
        }

        function attendedStatus(attended){
            if(attended){
                return(<span className="text-success"><Trans i18nKey='components.meetings.ATTENDED'></Trans></span>);
            } else {
                return(<span className="text-danger"><Trans i18nKey='components.meetings.NOT_ATTENDED'></Trans></span>);
            }
        }

        if(this.state.loadingMeetingMember){
            return (<span></span>);
        } else {
            return (
                <div className="list-group-item list-group-item-action">
                    <div className="media">
                        <div className={attendedClasses}><h3>{this.props.memberObj.title[0]}</h3></div>
                        <div className="media-body text-truncate">
                            <p className="mb-1">
                                <strong className="text-primary">
                                    <span>{this.props.memberObj.title}</span>
                                </strong>
                            </p>
                        </div>

                        <div className="ml-auto">
                            <em className={attendingClasses} id={"toolTip"+this.props.memberObj.key}></em>
                            <UncontrolledTooltip placement="bottom" target={"toolTip"+this.props.memberObj.key}>
                                <p><Trans i18nKey='components.meetings.INVITATION_SENT'></Trans>: {sentStatus(this.props.memberObj.mail_sent)}</p>
                                <p><Trans i18nKey='components.meetings.INVITATION_OPENED'></Trans>: {openedStatus(this.props.memberObj.mail_opened)}</p>
                                <p><Trans i18nKey='components.meetings.INVITATION_STATUS'></Trans>: {attendingStatus(this.props.memberObj.attending)}</p>
                                <p><Trans i18nKey='components.meetings.INVITATION_ATTENDED'></Trans>: {attendedStatus(this.props.memberObj.attended)}</p>
                            </UncontrolledTooltip>
                        </div>

                        <div className="ml-auto">
                            <Dropdown className="float-right" isOpen={this.state.dropdownMemberOpen} toggle={this.toggleMemberDD.bind(this)}>
                                <DropdownToggle className="icon-options">
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={this.sendInvite.bind(this)}><Trans i18nKey='components.members_modal.SEND_INVITATION'></Trans></DropdownItem>
                                    <DropdownItem><Trans i18nKey='components.meetings.REMOVE_MEMBER'></Trans></DropdownItem>
                                    <DropdownItem onClick={this.toggleAttended.bind(this)}><Trans i18nKey='components.meetings.ATTENDED'></Trans></DropdownItem>
                                    {/*<DropdownItem>Se logg</DropdownItem>*/}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            );
        }
    }
}
