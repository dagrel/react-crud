import React from 'react';
import { Router, Route, Link, History } from 'react-router-dom';
import { Input } from 'reactstrap';
import LoginRun from './Login.run';
import 'loaders.css/loaders.css';
//import { FirebaseAuth } from 'react-firebaseui';
//import firebase from 'firebase';
//import { firebaseApp, DB, Auth, UidKey, OrgKey, RoleKey } from '../Common/firebase';

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showLogin: true,
            showLoginLoading: false,
            showLoginError: false,
            showMobile: false,
            showMobileLoading: false,
            showMobileError: false,
            showMobileConfirm: false,
            showMobileConfirmLoading: false,
            showMobileConfirmError: false
        };
    };

    displayLogin() {
        this.setState({
            showLogin: true,
            showMobile: false,
            confirmMobileForm: false
        });
    }

    displayMobileLogin() {
        this.setState({
            showLogin: false,
            showMobile: true,
            confirmMobileForm: false
        });
    }

    displayConfirmMobileLogin() {
        this.setState({
            showLogin: false,
            showMobile: false,
            confirmMobileForm: true
        });
    }

    componentDidMount() {
        LoginRun(this);
    }

    render() {
        return (
            <div className="block-center mt-xl wd-xl">
                <div className="card card-flat">
                    <div className="card-header text-center bg-dark">
                        <a href="">
                            <img className="block-center rounded" />
                        </a>
                    </div>

                    <div className="card-body">
                        <p className="text-center pv">LOGG INN FOR Å FORTSETTE</p>

                        <form id="loginForm" role="form" data-parsley-validate="" noValidate className="mb-lg" style={{ display: this.state.showLogin ? '' : 'none' }}>
                            <div className="form-group has-feedback">
                                <input id="fbEmail" type="email" placeholder="Epostadresse" autoComplete="off" required="required" className="form-control" />
                            </div>
                            <div className="form-group has-feedback">
                                <input id="fbPass" type="password" placeholder="Passord" required="required" className="form-control" />
                            </div>
                            <div style={{ display: this.state.showLoginLoading ? 'none' : '' }} className="clearfix">
                                
                            </div>

                            <button style={{ display: this.state.showLoginLoading ? 'none' : '' }} type="submit" id="submitLogin" className="btn btn-block btn-primary mt-lg">Logg inn</button>
							
                            <ul style={{ display: (this.state.showLoginError && !this.state.showLoginLoading) ? '' : 'none' }} className="parsley-errors-list filled"><li className="parsley-required">Feil brukernavn eller passord</li></ul>
                            
                            <div className="ball-pulse" style={{ textAlign: 'center', display: this.state.showLoginLoading ? '' : 'none' }}>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </form>
                        
                        <form id="loginMobileForm" role="form" data-parsley-validate="" noValidate className="mb-lg" style={{ display: this.state.showMobile ? '' : 'none' }}>
                            <div className="form-group has-feedback">
                                <input id="fbMobile" type="text" data-parsley-type="digits" placeholder="Mobilnummer" autoComplete="off" required="required" className="form-control" />
                            </div>
                            <div style={{ display: this.state.showMobileLoading ? 'none' : '' }} className="clearfix">
                                <div className="text-right">
                                    <p className="text-muted text-link" onClick={this.displayLogin.bind(this, 'elements')}>Log inn med epostadresse?</p>
                                </div>
                            </div>

                            <button style={{ display: this.state.showMobileLoading ? 'none' : '' }} type="submit" id="submitLoginMobile" className="btn btn-block btn-primary mt-lg">Logg inn</button>
							
                            <ul style={{ display: (this.state.showMobileError && !this.state.showMobileLoading) ? '' : 'none' }} className="parsley-errors-list filled"><li className="parsley-required">Feil mobilnummer</li></ul>
                            
                            <div className="ball-pulse" style={{ textAlign: 'center', display: this.state.showMobileLoading ? '' : 'none' }}>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </form>

                        <form id="confirmMobileForm" role="form" data-parsley-validate="" noValidate className="mb-lg" style={{ display: this.state.showConfirmMobile ? '' : 'none' }}>
                            <div className="form-group has-feedback">
                                <input id="fbConfirm" type="text" placeholder="Kode" autoComplete="off" required="required" className="form-control" />
                                <span className="fa fa-key form-control-feedback text-muted"></span>
                            </div>
                            <div style={{ display: this.state.showConfirmMobileLoading ? 'none' : '' }} className="clearfix">
                                <div className="text-right">
                                    <p className="text-muted text-link" onClick={this.displayMobileLogin.bind(this, 'elements')}>Ikke fått koden?</p>
                                </div>
                            </div>

                            <button style={{ display: this.state.showConfirmMobileLoading ? 'none' : '' }} type="submit" id="submitConfirmMobile" className="btn btn-block btn-primary mt-lg">Logg inn</button>
							
                            <ul style={{ display: (this.state.showConfirmMobileError && !this.state.showConfirmMobileLoading) ? '' : 'none' }} className="parsley-errors-list filled"><li className="parsley-required">Feil kode</li></ul>
                            
                            <div className="ball-pulse" style={{ textAlign: 'center', display: this.state.showConfirmMobileLoading ? '' : 'none' }}>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </form>
                        
                    </div>
                    
                </div>
                
            </div>
        );
    }

}

export default Login;