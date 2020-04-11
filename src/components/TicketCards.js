import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Divider } from 'antd';
const { TabPane } = Tabs;

class TicketCards extends React.Component {
    state = {
        tickets: []
    }
    componentDidMount() {
        console.log(this.props);

        console.log(this.props.match.params.id);
        this._id = this.props.match.params.id;


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
                                return <span style={{
                                    border: '1px solid rgb(48, 194, 218)',
                                    background: '#8fefff',
                                    color: '#333',
                                    padding: '3px',
                                    borderRadius: '3px',
                                    margin: '0 3px'
                                }}>{employee.name}</span>
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
            debugger
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
                                return <span style={{
                                    border: '1px solid rgb(48, 194, 218)',
                                    background: '#8fefff',
                                    color: '#333',
                                    padding: '3px',
                                    borderRadius: '3px',
                                    margin: '0 3px'
                                }}>{employee.name}</span>
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
            debugger
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
                                return <span style={{
                                    border: '1px solid rgb(48, 194, 218)',
                                    background: '#8fefff',
                                    color: '#333',
                                    padding: '3px',
                                    borderRadius: '3px',
                                    margin: '0 3px'
                                }}>{employee.name}</span>
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
            debugger
            return el;
        })

    }




    getTicketsForTabs = (tabKey) => {
        if (tabKey == 1) {
            return this.props.tickets
        }
        else if (tabKey == 2) {
            return this.props.tickets.filter(ticket => !ticket.isResolved);
        }
        else {
            return this.props.tickets.filter(ticket => ticket.isResolved);
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