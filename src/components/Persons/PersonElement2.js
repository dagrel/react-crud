import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Router, Route, Link } from 'react-router-dom';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import { DB, OrgKey } from '../Common/firebase';
import * as moment from 'moment';

export default class PersonElement2 extends Component {
    componentDidMount() {

    }
    
    componentWillUnmount() {
        //this.unsubscribePerson();
    }

    render() {
        return (
            <Link to={`/person/${this.props.personObj.key}`} style={{ textDecoration: 'none' }}>
                <div className="list-group-item list-group-item-action" style={{marginBottom: "5px"}}>
                    <table className="wd-wide">
                        <tbody>
                            <tr>
                                <td>
                                    <div className="px-2">
                                        <p className="mb-2"><b>{this.props.personObj.first_name} {this.props.personObj.last_name}</b></p>
                                    </div>
                                </td>

                                <td className="wd-sm  d-none d-lg-table-cell">
                                    <div className="px-2">
                                        <p className="m-0">Adresse</p>
                                        <small>{this.props.personObj.address_1}</small>
                                    </div>
                                </td>
                                <td className="wd-sm  d-none d-lg-table-cell">
                                    <div className="px-2">
                                        <p className="m-0">Postkode</p>
                                        <small>{this.props.personObj.postcode}</small>
                                    </div>
                                </td>
                                <td className="wd-sm  d-none d-lg-table-cell">
                                    <div className="px-2">
                                        <p className="m-0">By</p>
                                        <small>{this.props.personObj.city}</small>
                                    </div>
                                </td>
                                <td className="wd-sm  d-none d-lg-table-cell">
                                    <div className="px-2">
                                        <p className="m-0">Foresatte</p>
                                        <small>{this.props.personObj.parents}</small>
                                    </div>
                                </td>
                                <td className="wd-sm  d-none d-lg-table-cell">
                                    <div className="px-2">
                                        <p className="m-0">Barn</p>
                                        <small>{this.props.personObj.children}</small>
                                    </div>
                                </td>
                                
                                <td className="wd-sm  d-none d-lg-table-cell">
                                    <div className="px-2">
                                        <p className="m-0">Fødselsdato</p>
                                        <small>{this.props.personObj.birthday}</small>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Link>
        );
    }
}
