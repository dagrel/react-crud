import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col } from 'reactstrap';

import { DB, OrgKey } from '../Common/firebase';


export default class UniPage extends Component {
    constructor() {
        super();
        

        this.unsubscribeAssets = null;

        this.tableData = JSON.parse(window.localStorage.getItem("test"));
        
        this.state = {
            loadingAssets: true,
            assets: [
            ],
            dropdownAssetsOpen: false
        };
    }


    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>
                        Uni Micro
                    </div>
                </div>
                
                <Row>
                
                
               
                </Row>
                <Row>
                    <Col>
                        <div className="card card-default">
                            
                            <h1>TEST</h1>
                        </div>
                    </Col>
                </Row>
            </ContentWrapper>
            );
    }

}