import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

export default class Message extends Component {
    constructor(props, context) {
        super();

        this.messageRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/messages/${props.messageId}`);

        this.unsubscribeMessage = null;
        
        this.state = {
            messageId: props.messageId,
            loading: false,
            message: {
                title: "",
                intro: "",
            }
        };
    }

    componentDidMount() {
        this.unsubscribeMessage = this.messageRef.onSnapshot(this.onMessageUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeMessage();
    }

    onMessageUpdate = (querySnapshot) => {
        let messageObj = querySnapshot.data();

        if(messageObj !== undefined){
            this.setState({ 
                message: messageObj,
                loading: false,
            });
        }
    }

    render() {
        if(this.state.loading){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                <div></div>
                <div></div>
                <div></div>
            </div>;
        } else {
            return (
                <div className="">
                    <Row>
                        <Col>
                            <div className="card-title"><h3>{this.state.message.title}</h3></div>
                            <p><b><Trans i18nKey='components.messages.CASE_DESCRIPTION'></Trans>:</b> {this.state.message.intro}</p>
                        </Col>
                    </Row>
                </div>
            );
        }
    }
}
