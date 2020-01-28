import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Router, Route, Link } from 'react-router-dom';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import * as moment from 'moment';

export default class Post extends Component {
    render() {
        let typeIcon = ["#edf000", "#000edf"];

        if(this.props.postObj.type === "referat"){
            return (
                <li>
                    <div className="">
                        <div className="card">
                            <div className="popover-header bg-purple-dark">
                                <small className="float-right"><Trans i18nKey='components.cases.LAST_EDITED'></Trans>: {moment(this.props.postObj.created.toDate()).format("DD.MM.YYYY HH:mm")}</small>
                                {this.props.postObj.by}
                            </div>
                            <div className="arrow"></div>
                            <div className="popover-body">
                                <p>
                                    {this.props.postObj.description.split('\n').map((item, key) => {
                                        return <span key={key}>{item}<br/></span>
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            );
        } else if(this.props.postObj.type === "comment"){
            return (
                <li>
                    <div className="">
                        <div className="card">
                            <div className="popover-header bg-primary-dark">
                                <small className="float-right"><Trans i18nKey='components.cases.LAST_EDITED'></Trans>: {moment(this.props.postObj.created.toDate()).format("DD.MM.YYYY HH:mm")}</small>
                                {this.props.postObj.by}
                            </div>
                            <div className="arrow"></div>
                            <div className="popover-body">
                                <p>
                                    {this.props.postObj.description.split('\n').map((item, key) => {
                                        return <span key={key}>{item}<br/></span>
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            );
        } else {
            return (
                <li>
                    <div className="">
                        <div className="card">
                            <div className="popover-header bg-green-dark">
                                <small className="float-right"><Trans i18nKey='components.cases.LAST_EDITED'></Trans>: {moment(this.props.postObj.created.toDate()).format("DD.MM.YYYY HH:mm")}</small>
                                {this.props.postObj.by}
                            </div>
                            <div className="arrow"></div>
                            <div className="popover-body">
                                <p>
                                    {this.props.postObj.description.split('\n').map((item, key) => {
                                        return <span key={key}>{item}<br/></span>
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            );
        }
    }
}