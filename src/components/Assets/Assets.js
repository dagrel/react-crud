import React, { Component } from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col } from 'reactstrap';
import AssetModal from "./AssetsModal"
import HandleTypes from "./HandleTypes"
import { DB, OrgKey } from '../Common/firebase';
import AssetsTable from './AssetsTable';


class AssetsPage extends Component {
    constructor() {
        super();
        
        this.assetsRef = DB.collection(`organizations/${window.localStorage.getItem(OrgKey)}/assets/instrumentarchive/items`);

        this.unsubscribeAssets = null;

        this.tableData = JSON.parse(window.localStorage.getItem("assets"));
        
        this.state = {
            loadingAssets: true,
            assets: [
            ],
            dropdownAssetsOpen: false
        };
    }

    componentDidMount() {
        
    }
    
    componentWillUnmount() {
        
    }

    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>
                        Kontakter
                    </div>
                </div>
                
                <Row>
                <AssetModal itemId = {0}  /> 
                
                <HandleTypes  />
                </Row>
                <Row>
                    <Col>
                        <div className="card card-default">
                            
                            <AssetsTable height="650" title="Instrumenter" />
                            
                        </div>
                    </Col>
                </Row>
            </ContentWrapper>
            );
    }

}

export default AssetsPage;