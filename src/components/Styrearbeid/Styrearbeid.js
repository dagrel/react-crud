import React, { Component } from 'react';
import { withNamespaces, Trans } from 'react-i18next';
import ContentWrapper from '../Layout/ContentWrapper';
import { Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip, Progress, Card, CardBody } from 'reactstrap';
import Meetings from './Meetings';
import Cases from './Cases';
import { DB, OrgKey } from '../Common/firebase';

import Scrollable from '../Common/Scrollable';

import { DragDropContext } from 'react-dnd'
import { Calendar, momentLocalizer } from 'react-big-calendar'
//import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Setup the localizer by providing the moment
const localizer = momentLocalizer(moment);
//const DragAndDropCalendar = withDragAndDrop(Calendar);

/**
 * Wrap an element and assign automatically an ID,
 * creates a handler to show/hide tooltips without
 * the hassle of creating new states and class methods.
 * Support only one child and simple text content.
 */
class BSTooltip extends Component {
    // static propTypes { content: PropTypes.string }
    state = {
        _id: 'id4tooltip_'+new Date().getUTCMilliseconds(),
        tooltipOpen: false
    }
    toggle = e => {
        this.setState({tooltipOpen: !this.state.tooltipOpen});
    }
    render() {
        return [
            <Tooltip {...this.props} isOpen={this.state.tooltipOpen} toggle={this.toggle} target={this.state._id} key='1'>
                {this.props.content}
            </Tooltip>,
            React.cloneElement(React.Children.only(this.props.children), {
                id: this.state._id,
                key: '2'
            })
        ]
    }
}


class Styrearbeid extends Component {
    constructor() {
        super();

        this.state = {
            events: [],
            dropdownMeetingOpen: false
        };
    }

    componentDidMount() {
        
    }
    
    componentWillUnmount() {
        
    }

    render() {
        return (
            <ContentWrapper>
                <Row>
                    <Col xl={ 8 }>
                        <div className="card card-default">
                            <Cases title="Saker" height="650px"></Cases>
                            {/* START card footer */}
                            <div className="card-footer"><a className="text-sm" href="/saker"><Trans i18nKey='utility.SHOW_MORE'></Trans></a></div>
                            {/* END card-footer */}
                        </div>
                    </Col>
                    <Col xl={ 4 }>
                        <div className="card card-default">
                            <Meetings title="Møter" height="250"></Meetings>
                            {/* START card footer */}
                            <div className="card-footer"><a className="text-sm" href="/moter"><Trans i18nKey='utility.SHOW_MORE'></Trans></a></div>
                            {/* END card-footer */}
                        </div>

                        <div className="card card-default">
                            <div className="card-header">
                                <div className="card-title"><Trans i18nKey='components.board.BOARD_CALENDAR'></Trans></div>
                            </div>
                            
                            <CardBody>
                                <Calendar
                                    localizer={localizer}
                                    style={{minHeight: 300}}
                                    selectable
                                    events={this.state.events}
                                    onEventDrop={this.moveEvent}
                                    resizable
                                    onEventResize={this.resizeEvent}
                                    onSelectEvent={this.selectEvent}
                                    defaultView="month"
                                    defaultDate={new Date()}
                                    eventPropGetter={this.parseStyleProp}
                                    views={['month']}
                                />
                            </CardBody>
                        </div>
                    </Col>
                </Row>
            </ContentWrapper>
            );
    }

}

export default withNamespaces('translations')(Styrearbeid);
