import React from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Modal, Form, Row, Col, Input, message, Table, Select, Tabs, Radio, Checkbox } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as ticketsAction from '../actions/ticketsAction';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;


class Tickets extends React.Component {

    constructor() {
        super();
        this.addTicketFormRef = React.createRef();
        this.state = {
            addModalVisible: false,
            addTicketLoading: false,
            tickets:  [],
            employees: [],
            customers: [],
            departments: [],
            allEmployees: []
        }
        this.tableColumns = [
            { title: 'Code', dataIndex: 'code', key: 1 },
            {
                title: 'Customer',
                key: 2,
                render: (record) => <div>{this.findCustomerById(record.customer)}</div>
            },
            {
                title: 'Department',
                key: 3,
                render: (record) => <div>{this.findDepartmentById(record.department)}</div>
            },
            {
                title: 'Employees', key: 4,
                render: (record) => {
                    {

                        if (record.employees) {
                            return record.employees.map(emp => {
                                return <span style={{
                                    border: '1px solid rgb(48, 194, 218)',
                                    background: '#8fefff',
                                    color: '#333',
                                    padding: '3px',
                                    borderRadius: '3px',
                                    margin: '0 3px'
                                }}> {this.findEmployeeById(emp._id)} </span>
                            })
                        }
                    }
                }
            },
            { title: 'Message', dataIndex: 'message', key: 5 },
            {
                key: 6,
                title: 'Action',
                render: (text, record) => {
                    return (
                        <div>
                        <Checkbox checked={record.isResolved} onChange={(e) => this.onTicketStatusChanged(e, record)}> 
                            <span style={{color: 'rgb(54, 143, 243)'}}>Change Status | </span> 
                        </Checkbox> 
                            <Link to={{
                                pathname: `/tickets/edit/${record._id}`,
                                state: { ticket: record }
                            }}>Edit | </Link>
                            <Link to={{
                                pathname: `/tickets/${record._id}`,
                                state: { ticket: record }
                            }}>Remove</Link>
                            
                        </div>

                    );
                }
            }
        ]
    }

    findCustomerById = (id) => {
        const customer = this.state.customers.find(customer => customer._id == id)
        if (customer) {
            return customer.name
        }
    }

    findDepartmentById = (id) => {

        const department = this.state.departments.find(dept => dept._id == id);
        if (department) {
            return department.name
        }

    }

    findEmployeeById = (id) => {
        const employee = this.state.allEmployees.find(employee => {
            return employee._id == id
        });

        if (employee) {
            return employee.name
        }
    }

    fetchDepartments = () => {
        axios.get(`http://dct-ticket-master.herokuapp.com/departments`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response, "DOLAFE");

                this.setState(prevState => {
                    return {
                        departments: [...response.data]
                    }
                })
            })
            .catch(err => message.error(err.message));
    }

    fetchEmployees = () => {
        axios.get(`http://dct-ticket-master.herokuapp.com/employees`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                this.setState({ allEmployees: [...response.data] });
            })
            .catch(err => message.error(err.message));
    }

    fetchCustomers = () => {
        axios.get(`http://dct-ticket-master.herokuapp.com/customers`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                this.setState(prevState => {
                    return {
                        customers: [...response.data]
                    }
                })
            })
            .catch(err => message.error(err.message));
    }

    componentDidMount() {
       
        this.fetchEmployees();
        this.fetchDepartments();
        this.fetchCustomers();
    }

    handleFormFieldsReset = () => {
        setTimeout(() => {
            this.addTicketFormRef.current.resetFields()
        }, 20);
    }

    onAddTicket = (values) => {
        console.log(values, "CuA");
        const { code, customer, department, message, priority } = values;

        const employees = values.employees.map(emp => JSON.parse(emp));
        this.setState({ addTicketLoading: true });
        axios.post(`${this.props.apiUrl}/tickets`, {
            code, customer, department, employees, message, priority
        }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                if (response && response.data.error) {
                    message.error(response.data.error);
                    this.setState({ addTicketLoading: false });
                }
                else {
                    this.setState(prevState => {
                        return {
                            addTicketLoading: false,
                            addModalVisible: false,
                            tickets: [...prevState.tickets, response.data]
                        }
                    })
                    this.props.dispatch(ticketsAction.startGetTickets());
                }
                this.setState({ addTicketLoading: false });
            })
            .catch(err => {
                console.log(err);
                message.error(err.message);
                this.setState({ addTicketLoading: false });
            })
    }

    onTabChanged = (tabIndx) => {
        this.setState({
            tickets: this.props.tickets.filter(ticket => tabIndx == 1 ? !ticket.isResolved : ticket.isResolved)
        })
    }

    onDeptChanged = (deptId) => {
        this.setState({
            employees: this.state.allEmployees.filter(employee => employee.department._id === deptId)
        })
    }

    onTicketStatusChanged = (e, ticket) => {
        console.log(e, ticket);
        axios.put(`http://dct-ticket-master.herokuapp.com/tickets/${ticket._id}`, {isResolved: e.target.checked}, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }})
            .then(response => {
                console.log(response);
                this.props.dispatch(ticketsAction.startGetTickets());
                
            })
    }

    getTicketsForTable = (tabKey) => {
        if(this.props.tickets){
              
           return this.props.tickets.filter(ticket => tabKey == 1 ? !ticket.isResolved : ticket.isResolved)
           
        }
        return [];
    }

    render() {
        const deptOptionsEl = this.state.departments.map(dept => {
            return (

                <Option key={dept._id} value={dept._id}>{dept.name}</Option>
            );
        })
        const employeeOptionsEl = this.state.employees.map(employee => {
            return (

                <Option key={employee._id} value={JSON.stringify(employee)}>{employee.name}</Option>
            );
        })
        const customersOptionsEl = this.state.customers.map(customer => {
            return (

                <Option key={customer._id} value={customer._id}>{customer.name}</Option>
            );
        })
        return (
            <div className="content-container">
                <div className="container-header">
                    <h2>Tickets  </h2>
                    <Button type="primary" icon={<PlusOutlined />}
                        onClick={() => this.setState({ addModalVisible: true }, () => this.handleFormFieldsReset())}>

                        Add Ticket
                    </Button>
                </div>
                <div>
                    <Tabs defaultActiveKey="1" onChange={this.onTabChanged}>
                        <TabPane tab="Pending" key="1" >
                            <Table
                                columns={this.tableColumns}
                                dataSource={ this.getTicketsForTable(1) }
                                rowKey="_id"
                                bordered
                            />
                        </TabPane>
                        <TabPane tab="Completed" key="2" >
                        <Table
                                columns={this.tableColumns}
                                dataSource={ this.getTicketsForTable(2) }
                                rowKey="_id"
                                bordered
                            />
                        </TabPane>
                    </Tabs>

                </div>
                {/* <Divider style={{width: '97%', minWidth: '97%', margin: 'auto'}} /> */}
                <Modal
                    title="Add Ticket"
                    centered
                    visible={this.state.addModalVisible}
                    onCancel={() => this.setState({ addModalVisible: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ addModalVisible: false })}>
                            Cancel
                        </Button>,
                        <Button form="addTicketForm" key="submit" type="primary" htmlType="submit" loading={this.state.addTicketLoading}>
                            Submit
                        </Button>,
                    ]}
                >

                    <Form id="addTicketForm" layout="vertical"
                        hideRequiredMark
                        ref={this.addTicketFormRef}
                        onFinish={this.onAddTicket}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="code"
                                    label="Code"
                                    rules={[{ required: true, message: 'Please enter code' }]}
                                >
                                    <Input placeholder="Please enter code" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="customer"
                                    label="Customer"
                                    rules={[{ required: true, message: 'Please select customer' }]}
                                >

                                    <Select
                                        placeholder="Select a option">
                                        {customersOptionsEl}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="department"
                                    label="Department"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Select department'
                                        },
                                    ]}
                                >
                                    <Select
                                        onChange={e => this.onDeptChanged(e)}
                                        placeholder="Select department"
                                        style={{ width: '100%' }}
                                    >
                                        {deptOptionsEl}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="employees"
                                    label="Employees"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Select employees'
                                        },
                                    ]}
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Select employees"
                                        style={{ width: '100%' }}
                                    >
                                        {employeeOptionsEl}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="message"
                                    label="Message"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Enter message'
                                        },
                                    ]}
                                >
                                    <TextArea />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="priority"
                                    label="Priority"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Radio.Group >
                                        <Radio value={"High"}>High</Radio>
                                        <Radio value={"Medium"}>Medium</Radio>
                                        <Radio value={"Low"}>Low</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        );

    }
}

function mapStateToProps(state) {
    console.log(state, "STATE");

    return {
        apiUrl: state.apiUrl,
        tickets: state.tickets
    }
}

export default connect(mapStateToProps)(Tickets);