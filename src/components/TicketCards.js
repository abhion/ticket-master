import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Divider } from 'antd';
const { TabPane } = Tabs;

class TicketCards extends React.Component {
    state = {
        tickets: [],
        ticketFilter: '',
        filterId: ''
    }
    componentDidMount() {
        console.log(this.props);
       let query = this.props.location.search.split('?')[1];
        
        let [ticketFilter, filterId] = query.split('=');
        this.setState({
            ticketFilter,
            filterId
        })
    }

    getCustomerById = (id) => this.props.customers.find(customer => customer._id == id) || {}

    getEmployeesById = (employeeIds) => this.props.employees
        .filter(employee => employeeIds.map(e => e._id).includes(employee._id))


    getDepartmentsById = (id) => this.props.departments.find(department => department._id == id) || {}

    renderAllTickets = (tickets) => {
        

        return tickets.map(ticket => {

            const el = (
                <div key={ticket._id}
                    className={ticket.isResolved ? 'completedCard ticket-card' : 'pendingCard ticket-card'}>
                    <h3 style={{ textAlign: 'right', margin: '5px' }}>Code: {ticket.code}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4>Customer: {this.getCustomerById(ticket.customer).name}</h4>
                        <h4>Department: {this.getDepartmentsById(ticket.department).name}</h4>
                        <h4>Priority: <span className={ticket.priority} >{ticket.priority}</span></h4>
                    </div>
                    <div >
                        <span style={{ fontWeight: 700 }} >Employees</span> - {
                            this.getEmployeesById(ticket.employees).map(employee => {
                                return <span className="employee-box">{employee.name}</span>
                            })
                        }
                    </div>
                    <Divider style={{ margin: '12px' }} />
                    <div>
                        <h3 style={{ marginBottom: '1px', marginTop: '5px' }}>Message:</h3>
                        <p>{ticket.message}</p>
                    </div>
                </div>
            );
            
            return el;
        })

    }

    renderPendingTickets = (tickets) => {

        return tickets.map(ticket => {

            const el = (
                <div key={ticket._id}
                    className="card ticket-card">
                    <h3 style={{ textAlign: 'right', margin: '5px' }}>Code: {ticket.code}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4>Customer: {this.getCustomerById(ticket.customer).name}</h4>
                        <h4>Department: {this.getDepartmentsById(ticket.department).name}</h4>
                        <h4>Priority: <span className={ticket.priority} >{ticket.priority}</span></h4>
                    </div>
                    <div >
                        <span style={{ fontWeight: 700 }} >Employees</span> - {
                            this.getEmployeesById(ticket.employees).map(employee => {
                                return <span className="employee-box">{employee.name}</span>
                            })
                        }
                    </div>
                    <Divider style={{ margin: '12px' }} />
                    <div>
                        <h3 style={{ marginBottom: '1px', marginTop: '5px' }}>Message:</h3>
                        <p>{ticket.message}</p>
                    </div>
                </div>
            );
            
            return el;
        })

    }

    renderCompletedTickets = (tickets) => {

        return tickets.map(ticket => {

            const el = (
                <div key={ticket._id}
                    className="card ticket-card">
                    <h3 style={{ textAlign: 'right', margin: '5px' }}>Code: {ticket.code}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4>Customer: {this.getCustomerById(ticket.customer).name}</h4>
                        <h4>Department: {this.getDepartmentsById(ticket.department).name}</h4>
                        <h4>Priority: <span className={ticket.priority} >{ticket.priority}</span></h4>
                    </div>
                    <div >
                        <span style={{ fontWeight: 700 }} >Employees</span> - {
                            this.getEmployeesById(ticket.employees).map(employee => {
                                return <span className="employee-box">{employee.name}</span>
                            })
                        }
                    </div>
                    <Divider style={{ margin: '12px' }} />
                    <div>
                        <h3 style={{ marginBottom: '1px', marginTop: '5px' }}>Message:</h3>
                        <p>{ticket.message}</p>
                    </div>
                </div>
            );
            
            return el;
        })

    }




    getTicketsForTabs = (tabKey) => {
        if(this.state.ticketFilter && this.state.filterId){
            if (tabKey == 1) {
                if(this.state.ticketFilter == 'employee'){
                    
                    return this.props.tickets.filter(ticket => ticket.employees.find(emp => emp._id == this.state.filterId));
                }
                return this.props.tickets.filter(ticket => ticket[this.state.ticketFilter] === this.state.filterId);
            }
            else if (tabKey == 2) {
                if(this.state.ticketFilter == 'employee'){
                    return this.props.tickets.filter(ticket => !ticket.isResolved && ticket.employees.find(emp => emp._id == this.state.filterId));
                }
                return this.props.tickets.filter(ticket => ticket[this.state.ticketFilter] === this.state.filterId && !ticket.isResolved);
            }
            else {
                if(this.state.ticketFilter == 'employee'){
                    return this.props.tickets.filter(ticket => ticket.isResolved && ticket.employees.find(emp => emp._id == this.state.filterId));
                }
                return this.props.tickets.filter(ticket => ticket[this.state.ticketFilter] === this.state.filterId && ticket.isResolved);
            }

        }
        else{
            return [];
        }
    }

    render() {

        return (
            <div className="content-container" >
                <div className="container-header">
                    <h2>Tickets</h2>

                </div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="All" key="1">
                        <div className="ticket-container">
                            {(this.renderAllTickets(this.getTicketsForTabs(1)))}
                        </div>
                    </TabPane>
                    <TabPane tab="Pending" key="2">
                        <div className="ticket-container">
                            {(this.renderPendingTickets(this.getTicketsForTabs(2)))}
                        </div>

                    </TabPane>
                    <TabPane tab="Completed" key="3">
                        <div className="ticket-container">
                            {(this.renderCompletedTickets(this.getTicketsForTabs(3)))}
                        </div>

                    </TabPane>
                </Tabs>
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        apiUrl: state.apiUrl,
        tickets: state.tickets,
        departments: state.departments,
        employees: state.employees,
        customers: state.customers
    }
}

export default connect(mapStateToProps)(TicketCards);