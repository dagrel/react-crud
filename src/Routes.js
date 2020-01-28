import React, { Suspense, lazy } from 'react';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { isAuthenticated, hasRole } from './components/Common/firebase';

/* loader component for Suspense*/
import PageLoader from './components/Common/PageLoader';

import Base from './components/Layout/Base';
import BasePage from './components/Layout/BasePage';

// import BaseHorizontal from './components/Layout/BaseHorizontal';

/* Used to render a lazy component with react-router */
const waitFor = Tag => props => <Tag {...props}/>;
const Assets = lazy(() => import('./components/Assets/Assets'));
const DetailedAssetView = lazy(() => import("./components/Assets/DetailedAssetView"));
const Contacts = lazy(() => import('./components/Uni/Contacts'));


const Login = lazy(() => import('./components/Pages/Login'));
const Logout = lazy(() => import('./components/Pages/Logout'));


const listofPages = [
    '/login',
    '/logout',
    
];

/**
 * Class representing a route that checks if user is logged in.
 * @extends Route
 */
class RoleRequiredRoute extends Route {
    /**
    * @example <RoleRequiredRoute path="/" component={Products}>
    */
    render() {
        // call some method/function that will validate if user is logged in
        if(!hasRole(this.props.role)){
            return <Redirect to="/styrearbeid"></Redirect>
        } else {
            return <this.props.component />
        }
    }
};

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
            // Layout component wrapper
            // Use <BaseHorizontal> to change layout
            <Base>
              <TransitionGroup>
                <CSSTransition key={currentKey} timeout={timeout} classNames={animationName} exit={false}>
                    <div>
                        <Suspense fallback={<PageLoader/>}>
                            <Switch location={location}>
                            
                                <Route path="/detaljer/:itemId" component={waitFor(DetailedAssetView)}/>
                                <Route path="/instrumenter" component={waitFor(Assets)}/>
                                <Route path="/kontakter" component={waitFor(Contacts)}/>

                                {/*<Route path="/detaljer/:itemId" component={waitFor(UniContactsDetails)}/>*/}

                                
                                <Redirect to="/styrearbeid"/>
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