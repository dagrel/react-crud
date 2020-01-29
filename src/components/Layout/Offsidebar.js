import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../store/actions/actions';

import { DB, OrgKey, UidKey, OrgNameKey, RoleKey, CalKey } from '../Common/firebase';

import { TabContent, TabPane, Nav, NavItem, NavLink, Button } from 'reactstrap';
import * as moment from 'moment';
import $ from 'jquery';

class Offsidebar extends Component {
    constructor(props, context) {
        super();

        var organizationsArray = this.state.organizations;

        var orgId = window.localStorage.getItem(OrgKey);
        var orgRef = DB.doc("uni/"+orgId);

        var uid = window.localStorage.getItem(UidKey);
        var userRef = DB.collection("users").doc(uid);

        let tState = this;

        var userRolesRef = DB.collection("users").doc(uid+"/ue/"+orgId);
        var userOrgTablesRef = DB.collection(`users/${uid}/ue/${orgId}/contacts`);
        var orgTablesRef = DB.collection(`ue/${orgId}/contacts`);
        
        Promise.all([orgRef.get(), userRef.get(), userRef.collection("ue").orderBy("name").get(), userRolesRef.get(), userOrgTablesRef.get(), orgTablesRef.get()]).then(function(results) {
            var org = results[0];
            var user = results[1];
            var organizations = results[2];
            
            if (org.exists) {
                var orgObj = org.data();
                tState.setState({
                    organization: orgObj
                });
            }

            if (user.exists) {
                var userObj = user.data();
                tState.setState({
                    user: userObj
                });
                
                if(user.id !== "vGzJAhd3tzgMFBD4DtWOwNCJotg2"){
                    var logRef = DB.collection("statistics/users/entry");

                    var logObj = {
                        uid: user.id,
                        username: userObj.username,
                        name: userObj.name,
                        timestamp: new Date()
                    };

                    logRef.add(logObj);
                }
            }

            organizations.forEach(function(organization) {
                var organizationObj = organization.data();
                organizationObj.id = organization.id;

                organizationsArray.push(organizationObj);
            });
            
            tState.setState({
                organizations: organizationsArray
            });

            let userRoles = results[3];
            let userOrgTables = results[4];
            let orgTables = results[5];

            userOrgTables.forEach((tableRef) => {
                const table = tableRef.data();
                window.localStorage.setItem(tableRef.id+"_columns", JSON.stringify(table));
            });

            orgTables.forEach((tableRef) => {
                const table = tableRef.data();
                window.localStorage.setItem(tableRef.id, JSON.stringify(table));
            });

            if(userRoles.data().roles !== undefined){
                window.localStorage.setItem(RoleKey, userRoles.data().roles.join(","));
            } else {
                window.localStorage.setItem(RoleKey, "");
            }

            if(userRoles.data().event_tags !== undefined){
                window.localStorage.setItem(CalKey, userRoles.data().event_tags.join(","));
            } else {
                window.localStorage.setItem(CalKey, "");
            }
        }).catch(function(error) {
            //state.props.history.push('/login');
        });
    }

    state = {
        user: {},
        organization: {},
        organizations: [],
        activeTab: 'user',
        offsidebarReady: false
    }

    componentDidMount() {
        // When mounted display the offsidebar
        this.setState({ offsidebarReady: true });
    }

    toggle = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    handleSettingCheckbox = event => {
        this.props.actions.changeSetting(event.target.name, event.target.checked);
    }

    handleThemeRadio = event => {
        this.props.actions.changeTheme(event.target.value);
    }

    openOrganizationModal() {
        
    }

    openUserModal() {
        
    }

    openPasswordModal() {

    }

    openMobileModal() {
        
    }

    render() {

        return (
            this.state.offsidebarReady &&
            <aside className="offsidebar">
                { /* START Off Sidebar (right) */ }
                <nav>
                    <div>
                        { /* Nav tabs */ }
                        <Nav tabs justified>
                            <NavItem>
                                
                            </NavItem>
                        </Nav>
                        { /* Tab panes */ }
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="user">
                                <h3 className="text-center text-thin">Brukerprofil</h3>
                                <div className="">
                                    <table className="table bb">
                                        <tbody>
                                        <tr>
                                            <td>
                                                <strong>Navn</strong>
                                            </td>
                                            <td className="text-right">
                                                <span className="padding-r">{ this.state.user.name }</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Epost</strong>
                                            </td>
                                            <td className="text-right">
                                                <span className="padding-r">{ this.state.user.email }</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Mobilnr</strong>
                                            </td>
                                            <td className="text-right">
                                                <span className="padding-r">{ this.state.user.mobile }</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Organisasjon</strong>
                                            </td>
                                            <td className="text-right">
                                                <span className="padding-r">{ this.state.organization.org_name }</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>SMS-innlogging</strong>
                                            </td>
                                            <td className="text-right" style={{ display: this.state.user.mobile_sign_in ? 'none' : '' }}>
                                                <span className="padding-r">Deaktivert</span>
                                            </td>
                                            <td className="text-right" style={{ display: this.state.user.mobile_sign_in ? '' : 'none' }}>
                                                <span className="padding-r">Aktivert</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Sist innlogget</strong>
                                            </td>
                                            <td className="text-right">
                                                <span className="padding-r">{moment(this.state.user.last_logged_in).format("DD.MM.YYYY HH:mm")}</span>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    {/*
                                    <div style={{ display: this.state.organizations.length > 1 ? '' : 'none', padding: "5px" }}>
                                        <Button color="primary" block onClick={this.openOrganizationModal.bind(this, 'elements')}>Velg organisasjon</Button>
                                    </div>

                                    <div style={{ padding: "5px" }}>
                                        <Button color="primary" block onClick={this.openUserModal.bind(this, 'elements')}>Rediger bruker</Button>
                                    </div>

                                    <div style={{ padding: "5px" }}>
                                        <Button color="primary" block onClick={this.openPasswordModal.bind(this, 'elements')}>Nytt passord</Button>
                                    </div>
                                    
                                    <div style={{ display: this.state.user.mobile_sign_in ? 'none' : '', padding: "5px" }}>
                                        <Button color="primary" block onClick={this.openMobileModal.bind(this, 'elements')}>Aktiver mobilinnlogging</Button>
                                    </div>
                                    */}
                                </div>
                            </TabPane>
                        </TabContent>
                    </div>
                </nav>
                { /* END Off Sidebar (right) */ }
            </aside>
        );
    }

}

Offsidebar.propTypes = {
    actions: PropTypes.object,
    settings: PropTypes.object,
    theme: PropTypes.object
};

const mapStateToProps = state => ({ settings: state.settings, theme: state.theme })
const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actions, dispatch) })

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Offsidebar);
