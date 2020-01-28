import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import classNames from 'classnames';

import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

export default class Case extends Component {
    constructor(props, context) {
        super();

        this.meetingCaseRef = props.caseObj.case;

        this.unsubscribeMeetingCase = null;
        
        this.state = {
            loadingMeetingCase: false,
            case: {
                created: firebaseTimestamp.fromDate(new Date())
            }
        };
    }

    componentDidMount() {
        //this.unsubscribeMeetingCase = this.meetingCaseRef.onSnapshot(this.onMeetingCaseUpdate);
    }
    
    componentWillUnmount() {
        //this.unsubscribeMeetingCase();
    }

    onMeetingCaseUpdate = (caseSnapshot) => {
        this.setState({ 
            case: caseSnapshot.data(),
            loadingMeetingCase: false,
        });
    }

    render() {
        //<Link to={`/sak/${this.props.caseObj.key}`} style={{ textDecoration: 'none' }}></Link>
        let meetingColor = ["#edf000", "#000edf"];

        var caseClasses = classNames(
            "list-group-item",
            "list-group-item-action",
            {
              'active': this.props.active
            }
        );

        if(this.state.loadingMeetingCase){
            return (<span></span>);
        } else {
            return (
                <div className={caseClasses} style={{marginBottom: "5px", cursor: "pointer"}} onClick={this.props.onClick}>
                    <table className="wd-wide">
                        <tbody>
                            <tr>
                                <td>
                                    <div className="px-2">
                                        <p className="mb-2"><b>{this.props.caseObj.title}</b></p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            );
        }
    }
}
