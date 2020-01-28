import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Card, CardHeader, CardBody, Row, Col, Alert, Table, FormGroup } from 'reactstrap';
import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';
import * as moment from 'moment';
import Scrollable from '../Common/Scrollable'

export default class Asset extends Component {
    constructor(props, context) {
        super();

        this.personRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/persons/${props.match.params.personId}`);

        this.unsubscribePerson = null;
        
        this.state = {
            personId: props.match.params.personId,
            loading: true,
            person: {
                title: "",
                description: "",
            }
        };
    }

    componentDidMount() {
        this.unsubscribePerson = this.personRef.onSnapshot(this.onPersonUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribePerson();
    }

    onPersonUpdate = (querySnapshot) => {
        let personObj = querySnapshot.data();

        this.setState({
            person: personObj,
            loading: false,
        });
    }

    render() {

        if(this.state.loading){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                <div></div>
                <div></div>
                <div></div>
            </div>;
        } else {
            //<MeetingCases meetingId={this.props.match.params.meetingId} height="560"></MeetingCases>
            return (
                <ContentWrapper>
                    <Card className="card-default">
                        <CardBody>
                            <Row>
                                <Col lg="6">
                                    <p className="lead bb">Personalia</p>
                                    <form className="form-horizontal">
                                        <FormGroup row>
                                            <Col md="4">Fornavn:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.first_name}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Etternavn:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.last_name}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Fødselsdato:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.birthday}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Kjønn:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.gender}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Status</Col>
                                            <Col md="8">
                                                <div className="badge badge-success">Aktiv</div>
                                            </Col>
                                        </FormGroup>
                                    </form>
                                </Col>
                                <Col lg="6">
                                    <p className="lead bb">Kontaktinfo</p>
                                    <form className="form-horizontal">
                                        <FormGroup row>
                                            <Col md="4">Epost:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.email_1}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Mobil:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.mobile}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Telefon:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.phone}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Adresse:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.address_1}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">Postkode:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.post_code}</strong>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md="4">By:</Col>
                                            <Col md="8">
                                                <strong>{this.state.person.city}</strong>
                                            </Col>
                                        </FormGroup>
                                    </form>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader>Oppgaver(?)</CardHeader>
                        <Table hover bordered striped responsive>
                            <thead>
                                <tr>
                                    <th>Oppgave</th>
                                    <th>Beskrivelse</th>
                                    <th className="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <a href="">Vakt</a>
                                    </td>
                                    <td>Skal være vakt for...</td>
                                    <td className="text-center">
                                        <span className="badge badge-warning">På vent</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <a href="">Kaffe</a>
                                    </td>
                                    <td>Skal ta med kaffe på...</td>
                                    <td className="text-center">
                                        <span className="badge badge-success">Ferdig</span>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Card>
                </ContentWrapper>
            );
        }
    }
}
