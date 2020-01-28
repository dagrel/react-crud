import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Router, Route, Link } from 'react-router-dom';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import classNames from 'classnames';

export default class Message extends Component {
    constructor(props, context) {
        super();
    }

    render() {
        //<Link to={`/sak/${this.props.messageObj.key}`} style={{ textDecoration: 'none' }}></Link>
        let meetingColor = ["#edf000", "#000edf"];

        var messageClasses = classNames(
            "list-group-item",
            "list-group-item-action",
            {
              'active': this.props.active
            }
        );

        return (
            <div className={messageClasses} style={{marginBottom: "5px", cursor: "pointer"}} onClick={this.props.onClick}>
                <table className="wd-wide">
                    <tbody>
                        <tr>
                            <td>
                                <div className="px-2">
                                    <p className="mb-2"><b>{this.props.messageObj.title}</b></p>
                                    <small>{this.props.messageObj.intro}</small>
                                </div>
                            </td>
                            <td className="wd-sm  d-none d-lg-table-cell">
                                <div className="px-2">
                                    <p className="m-0"><Trans i18nKey='utility.SENT'></Trans></p>
                                    <small>{moment(this.props.messageObj.created.toDate()).format("DD.MM.YYYY HH:mm")}</small>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
