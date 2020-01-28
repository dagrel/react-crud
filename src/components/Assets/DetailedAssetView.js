import React, { Component } from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Button } from 'reactstrap';
import { assetsColumn } from '../Common/tables';
import { DB, OrgKey } from '../Common/firebase';
import 'loaders.css/loaders.css';
import * as moment from 'moment';
import AssetModal from "./AssetsModal"
import ServiceHistoryModal from "./ServiceHistoryModal"
import MUIDataTable from "mui-datatables";
import ServiceTable from "./ServiceTable"

export default class DetailedAssetView extends Component {

    constructor(props) {
        super();

        this.assetRef = DB.doc(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items/${props.match.params.itemId}`);

        this.unsubscribeAsset = null;
        
        this.state = {
            assetId: props.match.params.itemId,
            loadingAsset: true,
            asset: {},
            allowedExtraFunctions: false,
            dropdownOpen: false,
        };
    }

    componentDidMount() {
        
        this.unsubscribeAsset = this.assetRef.onSnapshot(this.onAssetUpdate);
        
        // if allowed extra funcs vis fram kort 2 og 3 på høgre side
    }
    
    componentWillUnmount() {
        this.unsubscribeAsset();
    }
    

    onAssetUpdate = (querySnapshot) => {
        let asset = querySnapshot.data()

        if(asset.date_scrapped) {
            asset.date_scrapped = moment(asset.date_scrapped.toDate()).format("DD.MM.YYYY");
         } 
         if(asset.date_bought) {
            asset.date_bought = moment(asset.date_bought.toDate()).format("DD.MM.YYYY");
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
            
       let firstChar = this.state.asset.title;

        return (
            <ContentWrapper>
                <Row /*start på rad til venstre*/>
                    <Col lg="4">
                        <div className="card card-default" /* kort 1 venstre*/ > 
                            <div className="card-body text-center">
                                <div className="py-4">
                                   <h1>{firstChar.charAt(0).toUpperCase()}</h1> 
                                </div>
                                <h3 className="m-0 text-bold">{this.state.asset.title}</h3>
                                <div className="my-3">
                                   
                                </div>
                                <div className="text-center">
                                    <button type="button" className="btn btn-primary">Legg til bilde </button>
                                </div>
                            </div>
                        </div>

                        <div className="card card-default" /*kort 2  */>
                            <div className="card-header">
                                <div className="card-title text-center">Utlån</div>
                            </div>
                            <div className="card-body">
                                
                                <div className="card-body">
                                Lagerstatus: {this.state.asset.storage_status}
                                </div>

                                <div className="card-body">
                                Utlånt til: {this.state.asset.loaned_by}
                                </div>
                        
                                <div className="text-right">
                                <Button color="primary">Rediger</Button>
                                </div>
                            </div>
                        </div>

                        <div className="card card-default" /*kort 3  */>
                            <div className="card-header">
                                <ServiceHistoryModal />
                                <div className="card-title text-center">Service historikk</div>
                            </div>
                            <div className="card-body">
                                <ServiceTable />
                                
                            </div>
                        </div>

                    </Col>

                    <Col lg="8"> {/* start høgre kolonne */}

                            <Col lg="12" /* for å få egen kolonne inni kortet */>
                                <div className="card card-default" /* card start */>
                                    
                                    <div className="card-header d-flex align-items-center">
                                        <div className="d-flex justify-content-center col">
                                            <div className="h4 m-0 text-center">Instrument</div>
                                        </div>
                                        <AssetModal itemId = {this.state.assetId} />
                                    </div>
                            
                            <div className="card-body">
                            
                            <Row>
                            <Col lg="6"> {/* kolonne inni kortet oppe til høgre - venstre */}
                                <div className="col1">
                                    
                                        <div className="card-body">
                                        Merke: {this.state.asset.brand}
                                        </div>

                                        <div className="card-body">
                                        Serienummer: {this.state.asset.serialnumber}
                                        </div>

                                        <div className="card-body">
                                        Verdi: {this.state.asset.current_value}
                                        </div>

                                        <div className="card-body">
                                        Original pris: {this.state.asset.original_price}
                                        </div>
                                        
                                        
                                        <div className="card-body">
                                        Type: {this.state.asset.type_label}
                                        </div>

                                        <div className="card-body">
                                        Variant: {this.state.asset.variant_label}
                                        </div>

                                    </div>
                                    
                                </Col>
                                    
                                <Col lg="6">  {/* kolonne inni kort oppe til høgre - høgre */}
                                
                                    <div className="col2">
                                    <div className="card-body">
                                            Dato kjøpt: {this.state.asset.date_bought}
                                        </div>

                                        <div className="card-body">
                                            Dato kondemnert: {this.state.asset.date_scrapped}
                                        </div>

                                        <div className="card-body">
                                            Beskrivelse: {this.state.asset.description_long}
                                        </div> 

                                        <div className="card-body">
                                            Teknisk Beskrivelse: {this.state.asset.description_technical}
                                        </div> 

                                    </div>
                                </Col>   
                            </Row>

                        </div> 
                    </div> {/* card slutt */}
                </Col> 

                

                <div className="card card-default" /*kort 2 høgre side  */>
                    <div className="card-header">
                        <div className="card-title text-center">jaja </div>
                    </div>
                    <div className="card-body">
                        
                        <div className="card-body">
                        dsadsadsadsa 1
                        </div>

                        <div className="card-body">
                        dsadsa
                        </div>
                
                        <div className="text-right">
                        <Button color="primary">Rediger</Button>
                        </div>

                    </div>
                </div>

                    <div className="card card-default" /*kort 2 høgre side  */>
                        <div className="card-header">
                            <div className="card-title text-center">jaja</div>
                        </div>
                        <div className="card-body">
                            
                            <div className="card-body">
                            dsadsadsadsa 1
                            </div>

                            <div className="card-body">
                            dsadsadsa 2
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





