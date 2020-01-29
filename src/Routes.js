import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { isAuthenticated } from './components/Common/firebase';
import PageLoader from './components/Common/PageLoader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';


const waitFor = Tag => props => <Tag {...props}/>;
const Assets = lazy(() => import('./components/Assets/Assets'));
const DetailedAssetView = lazy(() => import("./components/Assets/DetailedAssetView"));


const Login = lazy(() => import('./components/Pages/Login'));
const Logout = lazy(() => import('./components/Pages/Logout'));


const listofPages = [
    '/login',
    '/logout',
    
];


/*class RoleRequiredRoute extends Route {
    render() {
        return <this.props.component />
    }
};*/

const Routes = ({ location }) => {
    const currentKey = location.pathname.split('/')[1] || '/';
    const timeout = { enter: 500, exit: 500 };

    const animationName = 'rag-fadeIn'

    if(listofPages.indexOf(location.pathname) > -1) {
        return (
            // Page Layout component wrapper
            <BasePage>
                <Suspense fallback={<PageLoader/>}>
                    <Switch location={location}>
                        <Route path="/login" component={waitFor(Login)}/>
                        <Route path="/logout" component={waitFor(Logout)}/>
                    </Switch>
                </Suspense>
            </BasePage>
        )
    }
    else if (!isAuthenticated()) {
        return (
            <Redirect to="/login"/>
        )
    }
    else {
        return (
            <Base>
              <TransitionGroup>
                <CSSTransition key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
                    <div>
                        <Suspense fallback={<PageLoader/>}>
                            <Switch location={location}>
                            
                                <Route path="/detaljer/:itemId" component={waitFor(DetailedAssetView)}/>
                                <Route path="/kontakter" component={waitFor(Assets)}/>
                                <Redirect to="/framside"/>
                            </Switch>
                        </Suspense>
                    </div>
                </CSSTransition>
              </TransitionGroup>
            </Base>
        )
    }
}

export default withRouter(Routes);