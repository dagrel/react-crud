import React from 'react';
import { Router, Route, Link, History } from 'react-router-dom';
import { Input } from 'reactstrap';
import LoginRun from './Login.run';
import 'loaders.css/loaders.css';

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showLogin: true,
            showLoginLoading: false,
            showLoginError: false,
        };
    };

    displayLogin() {
        this.setState({
            showLogin: true,
            
        });
    }

    displayMobileLogin() {
        this.setState({
            showLogin: false,
           
        });
    }

    displayConfirmMobileLogin() {
        this.setState({
            showLogin: false,
           
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
                    </div>
                    
                </div>
                
            </div>
        );
    }

}

export default Login;