import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Collapse, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Post from './Post';
import { debounce } from '../Common/tools';
import classNames from 'classnames';
import swal from 'sweetalert';

import Scrollable from '../Common/Scrollable'

import { firebaseTimestamp, DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';

import FormValidator from '../Forms/FormValidator.js';

export default class CasePosts extends Component {
    constructor(props, context) {
        super();

        this.casePostsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/cases/${props.caseId}/posts`);

        this.unsubscribeCasePosts = null;
        
        this.state = {
            loadingCasePosts: true,
            posts: [

            ],
            formPost: {
                comment: ''
            },
            formPostLoading: false,
            collapseCases: false
        };
    }

    componentDidMount() {
        this.unsubscribeCasePosts = this.casePostsRef.orderBy("created", "asc").onSnapshot(this.onCasePostsUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeCasePosts();
    }

    onCasePostsUpdate = (querySnapshot) => {
        let posts = [];
        let tstate = this;
      
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.key = doc.id;

          if(post.key === "Referat-"+tstate.props.meetingId){
            this.setState({ 
                formPost: {
                    comment: post.description
                },
            });
          }
          posts.push(post);
        });

        this.setState({ 
            posts,
            loadingCasePosts: false,
        });
    }

    validateOnChange = event => {
        const input = event.target;
        const form = input.form
        const value = input.type === 'checkbox' ? input.checked : input.value;

        const result = FormValidator.validate(input);

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                [input.name]: value,
                errors: {
                    ...this.state[form.name].errors,
                    [input.name]: result
                }
            }
        });

    }

    saveOnChange = event => {
        const input = event.target;
        const form = input.form
        const value = input.type === 'checkbox' ? input.checked : input.value;

        const result = FormValidator.validate(input);

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                [input.name]: value,
                errors: {
                    ...this.state[form.name].errors,
                    [input.name]: result
                }
            }
        });
        this.saveOnDebounce();
    }

    saveOnDebounce = debounce((arg, event) => {
        console.log(`Saving: ${this.state.formPost.comment}`);

        if(this.state.formPost.comment.length > 0){
            console.log(this.state.formPost);

            let tstate = this;
            this.setState({
                formPostLoading: true
            });

            let post = {
                by: "Referat - "+tstate.props.meetingName,
                created: firebaseTimestamp.fromDate(new Date()),
                description: this.state.formPost.comment,
                type: "referat",
                meeting: DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/rooms/styrearbeid/meetings/${tstate.props.meetingId}`),
            }
            
            this.casePostsRef.doc("Referat-"+tstate.props.meetingId).set(post).then(function() {
                //swal("Ok", "Saken har blitt lagt til", "success");

                tstate.setState({
                    formPostLoading: false
                });
            }).catch(err => {
                console.log(err);
                swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");

                tstate.setState({
                    formPostLoading: false
                });
            });
        }
    }, 800, true);

    onSubmitPost = e => {
        if(this.state.formPost.comment.length > 0){
            e.preventDefault();
            console.log(this.state.formPost);

            let tstate = this;
            this.setState({
                formPostLoading: true
            });

            let post = {
                by: "Referat",
                created: firebaseTimestamp.fromDate(new Date()),
                description: this.state.formPost.comment,
                type: "referat"
            }

            this.casePostsRef.doc("Referat").set(post).then(function() {
                //swal("Ok", "Saken har blitt lagt til", "success");

                tstate.setState({
                    formPostLoading: false
                });
            }).catch(err => {
                console.log(err);
                swal("Feil", "Det oppstod en feil, vennligst prøv igjen senere", "error");

                tstate.setState({
                    formPostLoading: false
                });
            });
        }

        e.preventDefault();
    }

    /* Simplify error check */
    hasError = (formName, inputName, method) => {
        return  this.state[formName] &&
                this.state[formName].errors &&
                this.state[formName].errors[inputName] &&
                this.state[formName].errors[inputName][method]
    }

    toggleCases() {
        this.setState({ collapseCases: !this.state.collapseCases });
    }

    render() {
        var buttonClasses = classNames(
            {
              'disabled': this.state.formPostLoading
            }
        );

        var buttonLoadingClasses = classNames(
            {
              'ball-pulse': this.state.formPostLoading
            }
        );

        
        if(this.state.collapseCases){
            var collapseButtonText = "Skjul kommentarer";
        } else {
            var collapseButtonText = "Vis kommentarer";
        }

        function posts(loading, posts){
            if(loading){
                return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                let postList = posts.map((postObj, index) => (
                    <Post key={index} postObj={postObj}></Post>
                ));
                return postList;
            }
        }

        return (
            <Row>
                <Col xl={ 12 }>
                    <Button color="primary" style={{marginBottom: "15px"}} onClick={this.toggleCases.bind(this)} active={this.state.collapseCases}>{collapseButtonText}</Button>

                    <Collapse isOpen={this.state.collapseCases}>
                        <Scrollable className="list-group" height={this.props.height}>
                            <ul style={{ listStyleType: "none", paddingLeft: "0px"}}>
                                {posts(this.state.loadingCasePosts, this.state.posts)}
                            </ul>
                        </Scrollable>
                    </Collapse>
                </Col>
                <Col xl={ 12 }>
                    <form onSubmit={this.onSubmitPost.bind(this)} action="" name="formPost" id="formPost">
                        <div className="ball-pulse" style={{ textAlign: 'center', display: !this.state.loadingCasePosts ? 'none' : '' }}>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>

                        <div className="card-footer clearfix" style={{ display: this.state.loadingCasePosts ? 'none' : '' }}>
                            <div className="input-group">
                                <Col xl={ 12 } className="card-body">
                                    <Input type="textarea"
                                        placeholder="Referat"
                                        name="comment"
                                        invalid={this.hasError('formPost','comment','required')}
                                        onChange={this.saveOnChange.bind(this)}
                                        data-validate='["required"]'
                                        value={this.state.formPost.comment}
                                        style={{height: "200px"}}
                                    />
                                    <span className="invalid-feedback"><Trans i18nKey='utility.REQUIRED'></Trans></span>
                                </Col>
                                <Col>
                                    <Button className={buttonClasses} color="primary" type="submit" form="formPost"><Trans i18nKey='components.cases.SAVE_REPORT'></Trans></Button>
                                    <div className={buttonLoadingClasses}>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>
                                </Col>
                            </div>
                        </div>
                    </form>
                </Col>
            </Row>
        );
    }
}
