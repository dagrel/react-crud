import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Router, Route, Link } from 'react-router-dom';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import * as moment from 'moment';

export default class Meeting extends Component {
    render() {
        let meetingColor = ["#edf000", "#000edf"];

        return (
            <Link to={`/mote/${this.props.meetingObj.key}`} style={{ textDecoration: 'none' }}>
                <div className="list-group-item list-group-item-action" style={{marginBottom: "5px"}}>
                    <table className="wd-wide">
                        <tbody>
                            <tr>
                                <td>
                                    <div className="px-2">
                                        <p className="mb-2"><b>{this.props.meetingObj.title}</b></p>
                                        <small className="text-muted">{this.props.meetingObj.description}</small>
                                    </div>
                                </td>
                                <td className="wd-sm  d-none d-lg-table-cell">
                                    <div className="px-2">
                                        <p className="m-0"><Trans i18nKey='components.meetings.MEETING_TIME'></Trans></p>
                                        <small className="text-muted">{moment(this.props.meetingObj.date.toDate()).format("DD.MM.YYYY HH:mm")}</small>
                                    </div>
                                </td>
                                <td className="wd-xs d-none d-lg-table-cell text-center">
                                    <div className="px-2 badge" style={{ backgroundColor: meetingColor[0], height:"16px"}}> </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Link>
        );
    }
}
