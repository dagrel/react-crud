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
const Register = lazy(() => import('./components/Pages/Register'));
const Recover = lazy(() => import('./components/Pages/Recover'));
const Lock = lazy(() => import('./components/Pages/Lock'));
const NotFound = lazy(() => import('./components/Pages/NotFound'));
const Error500 = lazy(() => import('./components/Pages/Error500'));
const Maintenance = lazy(() => import('./components/Pages/Maintenance'));


/*
const TestingAssets = lazy(() => import("./components/Assets/TestingAssets"));
const Styrearbeid = lazy(() => import('./components/Styrearbeid/Styrearbeid'));
const Case = lazy(() => import('./components/Case/Case'));
const Cases = lazy(() => import('./components/Cases/Cases'));
const Meeting = lazy(() => import('./components/Meeting/Meeting'));
const Meetings = lazy(() => import('./components/Meetings/Meetings'));
const Test = lazy(() => import('./components/Test/Test'));

const Messages = lazy(() => import('./components/Messages/Messages'));

const Person = lazy(() => import('./components/Person/Person'));
const Persons = lazy(() => import('./components/Persons/Persons'));
const Members = lazy(() => import('./components/Persons/Members'));
const Parents = lazy(() => import('./components/Persons/Parents'));


const Events = lazy(() => import('./components/Events/Events'));

const Event = lazy(() => import('./components/Event/Event'));
const EventsAdmin = lazy(() => import('./components/Events/EventsAdmin'));
const Calendar = lazy(() => import('./components/Events/Calendar'));

const DashboardV1 = lazy(() => import('./components/Dashboard/DashboardV1'));
const DashboardV2 = lazy(() => import('./components/Dashboard/DashboardV2'));
const DashboardV3 = lazy(() => import('./components/Dashboard/DashboardV3'));

const Widgets = lazy(() => import('./components/Widgets/Widgets'));

const Buttons = lazy(() => import('./components/Elements/Buttons'));
const Notifications = lazy(() => import('./components/Elements/Notifications'));
const SweetAlert = lazy(() => import('./components/Elements/SweetAlert'));
const BsCarousel = lazy(() => import('./components/Elements/Carousel'));
const Spinner = lazy(() => import('./components/Elements/Spinner'));
const DropdownAnimation = lazy(() => import('./components/Elements/DropdownAnimation'));
const Nestable = lazy(() => import('./components/Elements/Nestable'));
const Sortable = lazy(() => import('./components/Elements/Sortable'));
const Cards = lazy(() => import('./components/Elements/Cards'));
const Grid = lazy(() => import('./components/Elements/Grid'));
const GridMasonry = lazy(() => import('./components/Elements/GridMasonry'));
const Typography = lazy(() => import('./components/Elements/Typography'));
const FontIcons = lazy(() => import('./components/Elements/FontIcons'));
const WeatherIcons = lazy(() => import('./components/Elements/WeatherIcons'));
const Colors = lazy(() => import('./components/Elements/Colors'));

const ChartFlot = lazy(() => import('./components/Charts/ChartFlot'));
const ChartRadial = lazy(() => import('./components/Charts/ChartRadial'));
const ChartChartJS = lazy(() => import('./components/Charts/ChartChartJS'));
const ChartMorris = lazy(() => import('./components/Charts/ChartMorris'));
const ChartChartist = lazy(() => import('./components/Charts/ChartChartist'));

const MapsGoogle = lazy(() => import('./components/Maps/MapsGoogle'));
const MapsVector = lazy(() => import('./components/Maps/MapsVector'));

const TableStandard = lazy(() => import('./components/Tables/TableStandard'));
const TableExtended = lazy(() => import('./components/Tables/TableExtended'));
const Datatable = lazy(() => import('./components/Tables/DatatableView'));
const DataGrid = lazy(() => import('./components/Tables/DataGrid'));

const FormStandard = lazy(() => import('./components/Forms/FormStandard'));
const FormExtended = lazy(() => import('./components/Forms/FormExtended'));
const FormValidation = lazy(() => import('./components/Forms/FormValidation'));
const FormWizard = lazy(() => import('./components/Forms/FormWizard'));
const FormUpload = lazy(() => import('./components/Forms/FormUpload'));
const FormCropper = lazy(() => import('./components/Forms/FormCropper'));



const Mailbox = lazy(() => import('./components/Extras/Mailbox'));
const Timeline = lazy(() => import('./components/Extras/Timeline'));
const Calendar1 = lazy(() => import('./components/Extras/Calendar'));
const Invoice = lazy(() => import('./components/Extras/Invoice'));
const Search = lazy(() => import('./components/Extras/Search'));
const Todo = lazy(() => import('./components/Extras/Todo'));
const Profile = lazy(() => import('./components/Extras/Profile'));
const BugTracker = lazy(() => import('./components/Extras/BugTracker'));
const ContactDetails = lazy(() => import('./components/Extras/ContactDetails'));
const Contacts = lazy(() => import('./components/Extras/Contacts'));
const Faq = lazy(() => import('./components/Extras/Faq'));
const FileManager = lazy(() => import('./components/Extras/FileManager'));
const Followers = lazy(() => import('./components/Extras/Followers'));
const HelpCenter = lazy(() => import('./components/Extras/HelpCenter'));
const Plans = lazy(() => import('./components/Extras/Plans'));
const ProjectDetails = lazy(() => import('./components/Extras/ProjectDetails'));
const Projects = lazy(() => import('./components/Extras/Projects'));
const Settings = lazy(() => import('./components/Extras/Settings'));
const SocialBoard = lazy(() => import('./components/Extras/SocialBoard'));
const TeamViewer = lazy(() => import('./components/Extras/TeamViewer'));
const VoteLinks = lazy(() => import('./components/Extras/VoteLinks'));

const EcommerceOrder = lazy(() => import('./components/Ecommerce/EcommerceOrders'));
const EcommerceOrderView = lazy(() => import('./components/Ecommerce/EcommerceOrderView'));
const EcommerceProduct = lazy(() => import('./components/Ecommerce/EcommerceProducts'));
const EcommerceProductView = lazy(() => import('./components/Ecommerce/EcommerceProductView'));
const EcommerceCheckout = lazy(() => import('./components/Ecommerce/EcommerceCheckout'));

const BlogList = lazy(() => import('./components/Blog/BlogList'));
const BlogPost = lazy(() => import('./components/Blog/BlogPost'));
const BlogArticle = lazy(() => import('./components/Blog/BlogArticles'));
const BlogArticleView = lazy(() => import('./components/Blog/BlogArticleView'));

const ForumHome = lazy(() => import('./components/Forum/ForumHome'));
*/

// List of routes that uses the page layout
// listed here to Switch between layouts
// depending on the current pathname
const listofPages = [
    '/login',
    '/logout',
    '/register',
    '/recover',
    '/lock',
    '/notfound',
    '/error500',
    '/maintenance'
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

    // Animations supported
    //      'rag-fadeIn'
    //      'rag-fadeInRight'
    //      'rag-fadeInLeft'

    const animationName = 'rag-fadeIn'

    if(listofPages.indexOf(location.pathname) > -1) {
        return (
            // Page Layout component wrapper
            <BasePage>
                <Suspense fallback={<PageLoader/>}>
                    <Switch location={location}>
                        <Route path="/login" component={waitFor(Login)}/>
                        <Route path="/logout" component={waitFor(Logout)}/>
                        <Route path="/register" component={waitFor(Register)}/>
                        <Route path="/recover" component={waitFor(Recover)}/>
                        <Route path="/lock" component={waitFor(Lock)}/>
                        <Route path="/notfound" component={waitFor(NotFound)}/>
                        <Route path="/error500" component={waitFor(Error500)}/>
                        <Route path="/maintenance" component={waitFor(Maintenance)}/>
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

                                {/*
                                <Route path="/testingassets" component={waitFor(TestingAssets)}/>
                                <Route path="/styrearbeid" component={waitFor(Styrearbeid)}/>
                                <Route path="/sak/:caseId" component={waitFor(Case)}/>
                                <Route path="/saker" component={waitFor(Cases)}/>
                                <Route path="/mote/:meetingId" component={waitFor(Meeting)}/>
                                <Route path="/moter" component={waitFor(Meetings)}/>
                                <Route path="/test" component={waitFor(Test)}/>

                                <Route path="/meldingssenter" component={waitFor(Messages)}/>
                                
                                <Route path="/Person/:personId" component={waitFor(Person)}/>
                                
                                <Route path="/personer" component={waitFor(Persons)}/>
                                <Route path="/medlemmer" component={waitFor(Members)}/>
                                <Route path="/foresatte" component={waitFor(Parents)}/>

                                <Route path="/terminliste" component={waitFor(Events)}/>
                                <Route path="/aktivitet/:eventId" component={waitFor(Event)}/>
                                <Route path="/terminliste-admin" component={waitFor(EventsAdmin)}/>
                                <Route path="/kalender" component={waitFor(Calendar)}/>
                                
                                {/*Dashboard}
                                <Route path="/dashboardv1" component={waitFor(DashboardV1)}/>
                                <Route path="/dashboardv2" component={waitFor(DashboardV2)}/>
                                <Route path="/dashboardv3" component={waitFor(DashboardV3)}/>

                                {/*Widgets}
                                <Route path="/widgets" component={waitFor(Widgets)}/>

                                {/*Elements}
                                <Route path="/buttons" component={waitFor(Buttons)}/>
                                <Route path="/notifications" component={waitFor(Notifications)}/>
                                <Route path="/sweetalert" component={waitFor(SweetAlert)}/>
                                <Route path="/carousel" component={waitFor(BsCarousel)}/>
                                <Route path="/spinners" component={waitFor(Spinner)}/>
                                <Route path="/dropdown" component={waitFor(DropdownAnimation)}/>
                                <Route path="/nestable" component={waitFor(Nestable)}/>
                                <Route path="/sortable" component={waitFor(Sortable)}/>
                                <Route path="/cards" component={waitFor(Cards)}/>
                                <Route path="/grid" component={waitFor(Grid)}/>
                                <Route path="/grid-masonry" component={waitFor(GridMasonry)}/>
                                <Route path="/typography" component={waitFor(Typography)}/>
                                <Route path="/icons-font" component={waitFor(FontIcons)}/>
                                <Route path="/icons-weather" component={waitFor(WeatherIcons)}/>
                                <Route path="/colors" component={waitFor(Colors)}/>

                                {/*Forms}
                                <Route path="/form-standard" component={waitFor(FormStandard)}/>
                                <Route path="/form-extended" component={waitFor(FormExtended)}/>
                                <Route path="/form-validation" component={waitFor(FormValidation)}/>
                                <Route path="/form-wizard" component={waitFor(FormWizard)}/>
                                <Route path="/form-upload" component={waitFor(FormUpload)}/>
                                <Route path="/form-cropper" component={waitFor(FormCropper)}/>

                                {/*Charts}
                                <Route path="/chart-flot" component={waitFor(ChartFlot)}/>
                                <Route path="/chart-radial" component={waitFor(ChartRadial)}/>
                                <Route path="/chart-chartjs" component={waitFor(ChartChartJS)}/>
                                <Route path="/chart-morris" component={waitFor(ChartMorris)}/>
                                <Route path="/chart-chartist" component={waitFor(ChartChartist)}/>

                                {/*Table}
                                <Route path="/table-standard" component={waitFor(TableStandard)}/>
                                <Route path="/table-extended" component={waitFor(TableExtended)}/>
                                <Route path="/table-datatable" component={waitFor(Datatable)}/>
                                <Route path="/table-datagrid" component={waitFor(DataGrid)}/>

                                {/*Maps}
                                <Route path="/map-google" component={waitFor(MapsGoogle)}/>
                                <Route path="/map-vector" component={waitFor(MapsVector)}/>

                                {/*Extras}
                                <Route path="/mailbox" component={waitFor(Mailbox)}/>
                                <Route path="/timeline" component={waitFor(Timeline)}/>
                                <Route path="/calendar" component={waitFor(Calendar1)}/>
                                <Route path="/invoice" component={waitFor(Invoice)}/>
                                <Route path="/search" component={waitFor(Search)}/>
                                <Route path="/todo" component={waitFor(Todo)}/>
                                <Route path="/profile" component={waitFor(Profile)}/>
                                <Route path="/ecommerce-orders" component={waitFor(EcommerceOrder)}/>
                                <Route path="/ecommerce-order-view" component={waitFor(EcommerceOrderView)}/>
                                <Route path="/ecommerce-products" component={waitFor(EcommerceProduct)}/>
                                <Route path="/ecommerce-product-view" component={waitFor(EcommerceProductView)}/>
                                <Route path="/ecommerce-checkout" component={waitFor(EcommerceCheckout)}/>
                                <Route path="/blog-list" component={waitFor(BlogList)}/>
                                <Route path="/blog-post" component={waitFor(BlogPost)}/>
                                <Route path="/blog-articles" component={waitFor(BlogArticle)}/>
                                <Route path="/blog-article-view" component={waitFor(BlogArticleView)}/>
                                <Route path="/bug-tracker" component={waitFor(BugTracker)}/>
                                <Route path="/contact-details" component={waitFor(ContactDetails)}/>
                                <Route path="/contacts" component={waitFor(Contacts)}/>
                                <Route path="/faq" component={waitFor(Faq)}/>
                                <Route path="/file-manager" component={waitFor(FileManager)}/>
                                <Route path="/followers" component={waitFor(Followers)}/>
                                <Route path="/help-center" component={waitFor(HelpCenter)}/>
                                <Route path="/plans" component={waitFor(Plans)}/>
                                <Route path="/project-details" component={waitFor(ProjectDetails)}/>
                                <Route path="/projects" component={waitFor(Projects)}/>
                                <Route path="/settings" component={waitFor(Settings)}/>
                                <Route path="/social-board" component={waitFor(SocialBoard)}/>
                                <Route path="/team-viewer" component={waitFor(TeamViewer)}/>
                                <Route path="/vote-links" component={waitFor(VoteLinks)}/>

                                <Route path="/forum" component={waitFor(ForumHome)}/>
                                */}
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