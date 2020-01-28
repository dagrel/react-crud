import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import Events from './EventsTable';
import EventModal from './EventsModal';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

class EventsAdminPage extends Component {
    constructor() {
        super();

        this.state = {
            
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
                        Aktiviteter
                    </div>
                </div>
                <Row>
                    <Col>
                        <div className="card card-default">
                            <EventModal></EventModal>
                            <Events height="650" title="Aktiviteter" type="admin"></Events>
                            {/* START card footer */}
                        </div>
                    </Col>
                </Row>
            </ContentWrapper>
            );
    }

}

export default withNamespaces('translations')(EventsAdminPage);