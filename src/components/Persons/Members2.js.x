import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import PersonsList2 from './PersonsList2';
import { DB, OrgKey } from '../Common/firebase';

import Scrollable from '../Common/Scrollable'

import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

class MembersPage extends Component {
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
                        Medlemmer
                    </div>
                </div>
                <Row>
                    <Col>
                        <div className="card card-default">
                            <PersonsList2 height="650" type="members" title="Medlemmer"></PersonsList2>
                            {/* START card footer */}
                        </div>
                    </Col>
                </Row>
            </ContentWrapper>
            );
    }

}

export default withNamespaces('translations')(MembersPage);