import React, { Component } from 'react';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col } from 'reactstrap';
import AssetModal from "./AssetsModal"
import { DB, OrgKey } from '../Common/firebase';
import AssetsTable from './AssetsTable';


class AssetsPage extends Component {
    constructor() {
        super();
        

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
                
                </Row>
                <Row>
                    <Col>
                        <div className="card card-default">
                            
                            <AssetsTable height="650" title="Contacts" />
                            
                        </div>
                    </Col>
                </Row>
            </ContentWrapper>
            );
    }

}

export default AssetsPage;