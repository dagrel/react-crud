import React, { Component } from 'react';
import { Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ContentWrapper from '../Layout/ContentWrapper';
import { ListGroup, ListGroupItem } from 'reactstrap';
import sortable from 'html5sortable/dist/html5sortable.es.js';
import 'react-datetime/css/react-datetime.css';
import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';
import AddCustomType from "./AddCustomType"
import PopoverEditTypesInput from "./PopoverEditTypesInput"


export default class DragDropTypesList extends Component {
        constructor(props) {
            super();

            this.typesRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types`);
            this.variantsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/types/${props.typeId}/variant`);

            this.unsubscribeTypes = null;

            this.tableData = JSON.parse(window.localStorage.getItem("types"));

            this.state = {
                TypesModal: false,
                loadingTypes: true,
                types: [],
                newTypes: [],
                variants: []
            };
        }

        componentDidMount() {
            
            if(this.props.typeId) {

            this.unsubscribeVariants = this.variantsRef.onSnapshot(this.onTypesUpdate);

            }else {
                this.unsubscribeTypes = this.typesRef.orderBy("pri", "asc").onSnapshot(this.onTypesUpdate);
            }

          }
          
          componentWillUnmount() {
              if(this.props.typeId) {
                this.unsubscribeVariants();
              } else {
                this.unsubscribeTypes();
              }
          }
      
          onTypesUpdate = (querySnapshot) => {
              let types = [];
              
                querySnapshot.forEach((doc) => {
                  const typesObj = doc.data();
                  typesObj.key = doc.id;
                    types.push(typesObj);
                });
              this.setState({
                  types,
                  newTypes:types,
                  loadingTypes: false,
              });
          }

          ToggleTypesModal() {
            this.setState(prevState => ({
                TypesModal: !prevState.TypesModal
            }));
          
            const tstate = this

            setTimeout(function() { // prøv å kjør sortable etter du har valgt type
                sortable('.sortable', {
                    forcePlaceholderSize: true,
                    placeholder: '<div class="box-placeholder p0 m0"><div></div></div>'
                });

                sortable('.sortable')[0].addEventListener('sortupdate', function(e) {

                    var typesArray = [...tstate.state.newTypes]
                    var originalArray = [...tstate.state.types]

                    const start = e.detail.origin.index
                    const stop = e.detail.destination.index

                    var finalTypeObj = Object.assign({}, originalArray[e.detail.origin.index]);
                    var typeObj2 = typesArray[e.detail.origin.index]

                    finalTypeObj.pri = e.detail.destination.index
                    finalTypeObj.key = typeObj2.key
                    finalTypeObj.title = typeObj2.title

                    if (start > stop) {
                       for(var index = start-1; index >= stop; index--) {
                        
                        var typeObj = Object.assign({}, originalArray[index]);
                        var typeObj2 = typesArray[index]

                        var newPri = index+1;
                        typeObj.pri = newPri;
                        typeObj.key = typeObj2.key;
                        typeObj.title = typeObj2.title;
                        typesArray[newPri] = typeObj
                        }

                        typesArray[e.detail.destination.index] = finalTypeObj
                    }
                    
                    else if (start < stop) {
                        for(var index = start+1; index <= stop; index++) {
                            
                            var typeObj = Object.assign({}, originalArray[index]);
                            var typeObj2 = typesArray[index]
    
                            var newPri = index-1;
                            typeObj.pri = newPri;
                            typeObj.key = typeObj2.key;
                            typeObj.title = typeObj2.title;
                            typesArray[newPri] = typeObj
                            }
    
                            typesArray[e.detail.destination.index] = finalTypeObj
                    }

                    tstate.setState({
                        newTypes: typesArray
                    });
                });
              }, 500);    
        }

        toggle = () => {
            this.setState({
                dropdownOpen: !this.state.dropdownOpen
            });
        }


    render() {
        var typeList;
        if(this.props.view=="variants") {
        typeList = this.state.types.map((types, key) =>
        <ListGroupItem key={types.key} ><em className="fas fa-bars fa-fw text-muted mr-lg" style={{cursor:"pointer"}}></em>
        {types.title}
        <PopoverEditTypesInput typeId={this.props.typeId} variantId={types.key}  />
        </ListGroupItem>
        );

        } else {
        typeList = this.state.types.map((types, key) =>
        <ListGroupItem key={types.key} ><em className="fas fa-bars fa-fw text-muted mr-lg" style={{cursor:"pointer"}}></em>
        {types.title}
        <PopoverEditTypesInput typeId={types.key}  />
        </ListGroupItem>
        );
        }
        

        function modalForm(loading, state) 
        {
            if(loading){
                return <div className="ball-moda" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
            } else {
                return (
                <ContentWrapper>
                    <AddCustomType view={state.props.view} typeId={state.props.typeId} />
                    <Col lg={6} className="col-md-6 col-form-label">
                    <ListGroup className="sortable">
                        {typeList} 
                </ListGroup>
                </Col>
            </ContentWrapper>
                )
            }    
        }   if(this.props.view=="variants") {
            return (    
            <span>
                {modalForm(this.state.loadingTypes, this)}
            </span>  
            );
        }
        else{
            return ( 
                <span style={{float:"left", marginTop:"37px"}}>
                    <div >
                    <Button color="primary" onClick={this.ToggleTypesModal.bind(this)}>
                        Rediger typer
                    </Button>
                    </div>
                <div>
                    <Modal isOpen={this.state.TypesModal} className="modal-l" toggle={this.ToggleTypesModal.bind(this)}>
                        <ModalHeader toggle={this.ToggleTypesModal.bind(this)}>
                            Rediger instrument typer
                        </ModalHeader>
                        <ModalBody>
                            {modalForm(this.state.loadingTypes, this)}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.ToggleTypesModal.bind(this)}>Lukk</Button>
                        </ModalFooter>
                    </Modal>
                </div>
                </span>  
                );
        }
    }
}
