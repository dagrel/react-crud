import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import { Router, Route, Link } from 'react-router-dom';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import PropTypes from 'prop-types';
import { DB, OrgKey } from '../Common/firebase';
import * as moment from 'moment';

export default class PersonElement extends Component {
    constructor(props, context) {
        super();

        this.personDataRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/persons/${props.personId}/person_data`);
        this.personParentsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/persons/${props.personId}/parents`);
        this.personChildrenRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/persons/${props.personId}/children`);

        this.unsubscribePerson = null;
        
        this.state = {
            personId: props.personId,
            loadingPersonData: true,
            personData: {
            },
            parents: [],
            children: []
        };
    }

    componentDidMount() {
        let tState = this;

        Promise.all([this.personDataRef.get(), this.personParentsRef.get(), this.personChildrenRef.get()]).then(function(results) {
            let personDataResult = results[0];
            let parentDataResult = results[1];
            let childrenDataResult = results[2];

            let personData = {};
            let parents = [];
            let children = [];

            personData.addressObj = personDataResult.docs[0].data();
            personData.commentObj = personDataResult.docs[1].data();
            personData.memberInfoObj = personDataResult.docs[2].data();
            personData.metaObj = personDataResult.docs[3].data();

            parentDataResult.forEach(function(parent) {
                parents.push(parent.data().name);
            });

            childrenDataResult.forEach(function(child) {
                children.push(child.data().name);
            });
            
            tState.setState({
                personData: personData,
                parents: parents,
                children: children,
                loadingPersonData: false,
            });
        });
        /*
        this.unsubscribePerson = this.personDataRef.get().then(function(results) {
            //results.docs.map(doc => doc.data());
            //console.log(personData);
            //console.log(results.address);
            //console.log(results.address.data());
        });
        */
    }
    
    componentWillUnmount() {
        //this.unsubscribePerson();
    }
    /*
    onPersonUpdate = (querySnapshot) => {
        let personObj = querySnapshot.data();
        
        let pData = {
            addressObj: {
                personObj
            }
        }

        this.setState({
            personData: {
                addressObj: {
                    address_1: personObj.address_1
                }
            },
            loading: false,
        });
    }
    */

    render() {
        function personData(state){
            if(state.state.loadingPersonData){
                return <td className="ball-pulse" style={{ textAlign: 'center' }}>
                    <span></span>
                    <span></span>
                    <span></span>
                </td>;
            } else {
                const Aux = props => props.children;
                
                return <Aux>
                    <td className="wd-sm  d-none d-lg-table-cell">
                        <div className="px-2">
                            <p className="m-0">Adresse</p>
                            <small>{state.state.personData.addressObj.address_1}</small>
                        </div>
                    </td>
                    <td className="wd-sm  d-none d-lg-table-cell">
                        <div className="px-2">
                            <p className="m-0">Postkode</p>
                            <small>{state.state.personData.addressObj.postcode}</small>
                        </div>
                    </td>
                    <td className="wd-sm  d-none d-lg-table-cell">
                        <div className="px-2">
                            <p className="m-0">By</p>
                            <small>{state.state.personData.addressObj.city}</small>
                        </div>
                    </td>
                    <td className="wd-sm  d-none d-lg-table-cell">
                        <div className="px-2">
                            <p className="m-0">Foresatte</p>
                            <small>{state.state.parents.join(', ')}</small>
                        </div>
                    </td>
                    <td className="wd-sm  d-none d-lg-table-cell">
                        <div className="px-2">
                            <p className="m-0">Barn</p>
                            <small>{state.state.children.join(', ')}</small>
                        </div>
                    </td>
                </Aux>;
            }
        }

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

                                { personData(this) }
                                
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
