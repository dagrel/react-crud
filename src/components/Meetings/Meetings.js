import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import Meetings from '../Styrearbeid/Meetings';
import { DB, OrgKey } from '../Common/firebase';

import Scrollable from '../Common/Scrollable'

import { DragDropContext } from 'react-dnd'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

class MeetingsPage extends Component {
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
                    <Trans i18nKey='components.meetings.MEETINGS'></Trans>
                    </div>
                </div>
                <Row>
                    <Col>
                        <div className="card card-default">
                            <Meetings height="650"></Meetings>
                            {/* START card footer */}
                        </div>
                    </Col>
                </Row>
            </ContentWrapper>
            );
    }

}

export default withNamespaces('translations')(MeetingsPage);
