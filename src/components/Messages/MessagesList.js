import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Message from '../Message/Message';
import MessageBody from '../Message/MessageBody';
import MessageModal from '../Message/MessageModal';

import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import ScrollArea from 'react-scrollbar';

export default class Messages extends Component {
    constructor() {
        super();

        this.messagesRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/messages`);

        this.unsubscribeMessages = null;
        
        this.state = {
            loadingMessages: true,
            messages: [
            ],
            dropdownMessagesOpen: false,
            messageStep: 0,
            messageId: ""
        };
    }

    componentDidMount() {
        this.unsubscribeMessages = this.messagesRef.orderBy("created", "desc").onSnapshot(this.onMessagesUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeMessages();
    }

    onMessagesUpdate = (querySnapshot) => {
        let messages = [];
      
        querySnapshot.forEach((doc) => {
          const messageObj = doc.data();
          messageObj.key = doc.id;
          messages.push(messageObj);
        });

        this.setState({ 
            messages,
            loadingMessages: false,
        });
    }

    toggleMessagesDD = () => {
        this.setState({
            dropdownMessagesOpen: !this.state.dropdownMessagesOpen
        });
    }

    displayMessages() {
        this.setState({
            messageStep: 0,
            messageId: ""
        });
    }

    openMessage(state, messageId, event) {
        state.setState({
            messageStep: 1
        });
        setTimeout(function(){
            state.setState({
                messageStep: 2,
                messageId: messageId
            });
        }, 10);
    }

    render() {
        function messages(loading, messages, state, onClick){
            if(loading){
                return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                let messagesList = messages.map((messageObj, index) => {
                    if(state.state.messageId == messageObj.key){
                        return <Message key={index} messageObj={messageObj} active={true} onClick={onClick.bind(this, state, messageObj.key)}></Message>;
                    }
                    return <Message key={index} messageObj={messageObj} onClick={onClick.bind(this, state, messageObj.key)}></Message>;
                });
                return messagesList;
            }
        }

        if(this.state.messageStep == 0){
            return (
                <div>
                    <div className="card-header">
                        <Trans i18nKey='components.messages.MESSAGES'></Trans>
                    </div>
    
                    <MessageModal></MessageModal>

                    <ScrollArea
                        speed={0.8}
                        className="card-body"
                        contentClassName="content"
                        horizontal={true}
                        vertical={true}
                        style={{"height": this.props.height}}
                        >
                        {messages(this.state.loadingMessages, this.state.messages, this, this.openMessage)}
                    </ScrollArea>
                </div>
            );
        } else if(this.state.messageStep == 1){
            return (
                <Row>
                    <Col xl={5}>
                        <div>
                            <div className="card-header">
                                <Trans i18nKey='components.messages.MESSAGES'></Trans>
                            </div>
            
                            <MessageModal></MessageModal>

                            <ScrollArea
                                speed={0.8}
                                className="card-body"
                                contentClassName="content"
                                horizontal={true}
                                vertical={true}
                                style={{"height": this.props.height}}
                                >
                                {messages(this.state.loadingMessages, this.state.messages, this, this.openMessage)}
                            </ScrollArea>
                        </div>
                    </Col>
                    <Col xl={7}>
                        <div>
                            <div className="card-header">
                                <div className="card-title"><Trans i18nKey='components.messages.MESSAGE'></Trans></div>
                            </div>
                            
                            <Button style={{marginBottom: "15px"}} color="primary" onClick={this.displayMessages.bind(this)}><Trans i18nKey='utility.CLOSE_BUTTON'></Trans></Button>
                        </div>
                    </Col>
                </Row>
            );
        } else if(this.state.messageStep == 2){
            return (
                <Row>
                    <Col xl={5}>
                        <div>
                            <div className="card-header">
                                <Trans i18nKey='components.messages.MESSAGES'></Trans>
                            </div>
            
                            <MessageModal></MessageModal>

                            <ScrollArea
                                speed={0.8}
                                className="card-body"
                                contentClassName="content"
                                horizontal={true}
                                vertical={true}
                                style={{"height": this.props.height}}
                                >
                                {messages(this.state.loadingMessages, this.state.messages, this, this.openMessage)}
                            </ScrollArea>
                        </div>
                    </Col>
                    <Col xl={7}>
                        <div>
                            <div className="card-header">
                                <div className="card-title"><Trans i18nKey='components.messages.MESSAGE'></Trans></div>
                            </div>
                            
                            <Button style={{marginBottom: "15px"}} color="primary" onClick={this.displayMessages.bind(this)}><Trans i18nKey='utility.CLOSE_BUTTON'></Trans></Button>

                            <MessageBody messageId={this.state.messageId}></MessageBody>
                        </div>
                    </Col>
                </Row>
            );
        }
    }
}
