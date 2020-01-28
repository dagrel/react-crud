import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import Post from './Post';
//import PostModal from './PostModal';

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
      
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          post.key = doc.id;
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

    onSubmitPost = e => {
        const form = e.target;
        const inputs = [...form.elements].filter(i => ['INPUT', 'SELECT'].includes(i.nodeName))

        const { errors, hasError } = FormValidator.bulkValidate(inputs)

        this.setState({
            [form.name]: {
                ...this.state[form.name],
                errors
            }
        });

        if(!hasError && this.state.formPost.comment.length > 0){
            e.preventDefault();
            console.log(this.state.formPost);

            let tstate = this;
            this.setState({
                formPostLoading: true
            });

            let post = {
                by: "person navn",
                created: firebaseTimestamp.fromDate(new Date()),
                description: this.state.formPost.comment,
                type: "comment"
            }

            this.casePostsRef.doc().set(post).then(function() {
                //swal("Ok", "Saken har blitt lagt til", "success");

                tstate.setState({
                    formPostLoading: false,
                    formPost: {
                        comment: ''
                    }
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

    render() {
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
                    <Scrollable className="list-group" height={this.props.height}>
                        <ul style={{ listStyleType: "none", paddingLeft: "0px"}}>
                            {posts(this.state.loadingCasePosts, this.state.posts)}
                        </ul>
                    </Scrollable>
                </Col>
                <Col xl={ 12 }>
                    <form onSubmit={this.onSubmitPost.bind(this)} action="" name="formPost" id="formPost">
                        <div className="card-footer clearfix">
                            <div className="input-group">
                                <Input type="text"
                                    placeholder="Send kommentar..."
                                    name="comment"
                                    invalid={this.hasError('formPost','comment','required')}
                                    onChange={this.validateOnChange.bind(this)}
                                    data-validate='["required"]'
                                    value={this.state.formPost.comment}
                                />
                                <span className="input-group-btn">
                                    <button className="btn btn-secondary btn-sm" type="submit" form="formPost" style={{padding: "6px"}}><i className="fa fa-check"></i>
                                    </button>
                                </span>
                            </div>
                        </div>
                    </form>
                </Col>
            </Row>
        );
    }
}

/*
                            <div className="form-group">
                                <Col xl={ 6 } className="card-body">
                                    <Input type="textarea"
                                        placeholder="Kommentar"
                                        name="comment"
                                        invalid={this.hasError('formPost','comment','required')}
                                        onChange={this.validateOnChange.bind(this)}
                                        data-validate='["required"]'
                                        value={this.state.formPost.comment}
                                    />
                                    <span className="invalid-feedback">Må fylles ut</span>
                                </Col>
                                <Col>
                                    <Button color="primary" type="submit" form="formPost">Send kommentar</Button>
                                </Col>
                            </div>
*/
