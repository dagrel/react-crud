import React, { Component } from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Button } from 'reactstrap';
import { assetsColumn } from '../Common/tables';
import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';
import * as moment from 'moment';
import AssetModal from "./AssetsModal"

export default class DetailedAssetView extends Component {

    constructor(props) {
        super();

        this.assetRef = DB.doc(`/uni/qG7hSy1hnz9RpiIZ1u1u/contacts/${props.match.params.itemId}`);

        this.unsubscribeAsset = null;
        
        this.state = {
            assetId: props.match.params.itemId,
            loadingAsset: true,
            asset: {},
            dropdownOpen: false,
        };
    }

    componentDidMount() {
        this.unsubscribeAsset = this.assetRef.onSnapshot(this.onAssetUpdate);
    }
    
    componentWillUnmount() {
        this.unsubscribeAsset();
    }
    

    onAssetUpdate = (querySnapshot) => {
        let asset = querySnapshot.data()

        if(asset.created) {
            asset.created = moment(asset.created.toDate()).format("DD.MM.YYYY");
         } 
         if(asset.altered) {
            asset.altered = moment(asset.altered.toDate()).format("DD.MM.YYYY");
         }
         
        this.setState({
            asset: asset,
            loadingAsset: false,
        }); 
    }

    render() {

        if(this.state.loadingAsset){
            return <div className="ball-pulse" style={{ textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>;
        }
        
        else {
            
        return (
            <ContentWrapper>
                <Row /*start på rad til venstre*/>
                    <Col lg="4">
                        <div className="card card-default" /* kort 1 venstre*/ > 
                            <div className="card-body text-center">
                                <h1 className="m-0 text-bold">{this.state.asset.Role}</h1>
                            </div>
                        </div>

                        <div className="card card-default" /*kort 2  */>
                            <div className="card-header">
                                <div className="card-title text-center">Datoer</div>
                            </div>
                            <div className="card-body">
                                
                                <div className="card-body">
                                Opprettet: {this.state.asset.created}
                                </div>

                                <div className="card-body">
                                Endret: {this.state.asset.altered}
                                </div>
                            </div>
                        </div>

                        <div className="card card-default" /*kort 3  */>
                            <div className="card-header">
                                <div className="card-title text-center">ID info</div>
                            </div>

                            <div className="card-body">
                                ID: {this.state.asset.ID}
                            </div>
                            <div className="card-body">
                                Info ID: {this.state.asset.InfoID}
                            </div>
                            <div className="card-body">
                                Relasjons ID: {this.state.asset.ParentBusinessRelationID}
                            </div>
                        </div>

                    </Col>

                    <Col lg="8"> {/* start høgre kolonne */}

                            <Col lg="12" /* for å få egen kolonne inni kortet */>
                                <div className="card card-default" /* card start */>
                                    
                                    <div className="card-header d-flex align-items-center">
                                        <div className="d-flex justify-content-center col">
                                            <div className="h4 m-0 text-center">Utfyllende info</div>
                                        </div>
                                        <AssetModal itemId = {this.state.assetId} />
                                    </div>
                            
                            <div className="card-body">
                            
                            <Row>
                            <Col lg="6"> {/* kolonne inni kortet oppe til høgre - venstre */}
                                <div className="col1">
                                    
                                        <div className="card-body">
                                        Status: {this.state.asset.StatusCode}
                                        </div>

                                        <div className="card-body">
                                        Opprettet av: {this.state.asset.CreatedBy}
                                        </div>

                                        <div className="card-body">
                                        Endret av: {this.state.asset.UpdatedBy}
                                        </div>

                                    </div>
                                    
                                </Col>
                                    
                                <Col lg="6">  {/* kolonne inni kort oppe til høgre - høgre */}
                                
                                    
                                </Col>   
                            </Row>

                        </div> 
                    </div> {/* card slutt */}
                </Col> 

                    <div className="card card-default" /*kort 2 høgre side  */>
                        <div className="card-header">
                            <div className="card-title text-center">Kommentar</div>
                        </div>
                        <div className="card-body">
                            
                            <div className="card-body">
                            Kommentar   {this.state.asset.Comment}
                            </div>

                            <div className="text-right">
                            <Button color="primary">Rediger</Button>
                            </div>

                        </div>
                    </div>
            </Col>
        </Row>
    </ContentWrapper>
    );
    }
}
}





