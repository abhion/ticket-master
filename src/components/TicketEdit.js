import React from 'react';
import { Row, Col, Form, Input, Button, message as mess, Select, Radio } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import createHistory from 'history/createBrowserHistory'
import * as ticketsAction from '../actions/ticketsAction';
import { setLoginActionFalse } from '../actions/setLoginAction';
const { Option } = Select;

const {TextArea} = Input;

class TicketEdit extends React.Component {
    editTicketFormRef = React.createRef();
    _id = null;
  
    constructor() {
        super();
        this.state = {
            submitBtnLoading: false,
            selectedEmployees: [],
            employees: []
        }
        this.employees = [];
    }

    fetchEmployees = () => {
        return axios.get(`http://dct-ticket-master.herokuapp.com/employees`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                return Promise.resolve(response.data);
            })
            .catch(err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err));
    }

    componentDidMount() {
       console.log( "this.props.location.state.", this.props);
        this._id = this.props.location.state.ticket._id;
        const { code, employees, customer, message, priority, department } = this.props.location.state.ticket;
        this.employees = employees;
       this.department = department;
    //    if(!this.props.employees.length){
    //     this.fetchEmployees()
    //         .then(res => {
                
    //             this.setState({
    //                 employees: res.filter(employee => employee.department._id === this.department)
    //             })
    //         })
    //    }
        // [this.code, this.customer, this.employees, this.message, this.department] = [code, customer, employees, message, priority, department ];
        this._id = this.props.location.state.ticket._id;
        this.editTicketFormRef.current.setFieldsValue({
            code, customer, message, priority, department
        });
        

    }
    


    componentWillUnmount() {
        
            this.props.history.replace({ pathname: '', state: {} })
        
    }

    onEditTicket = (values) => {
        console.log(values);
        const { code, customer, department, message, priority } = values;
        this.setState({submitBtnLoading: true})
        axios.put(`${this.props.apiUrl}/tickets/${this._id}`, {
            code, customer, department, employees: this.employees, message, priority
        }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                const history = createHistory();
                this.setState({submitBtnLoading: false})
                mess.success('Updated');
                this.props.dispatch(ticketsAction.startGetTickets());
                if (history.location.state && history.location.state.ticket) {
                    let state = { ...history.location.state };
                    delete state.ticket;
                    history.replace({ ...history.location, ...{ state: { ticket: response.data } } });
                    console.log(this.props.location, "FPa");

                }
            })
            .catch(err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err));
    }

    onReset = () => {
        this.editTicketFormRef.current.resetFields();
    };

    onFill = () => {
        this.editTicketFormRef.current.setFieldsValue({
            note: 'Hello world!',
            gender: 'male',
        });
    };

    onDeptChanged = (deptId) => {
        
        this.setState({
            employees: this.props.employees.filter(employee => employee.department._id === deptId)
        })
    }

    render() {

        const selectedEmployees = this.employees.map(empId => {
            
            const empObj = this.props.employees.find(employee => {
                
                return employee._id == empId._id
            });
            return empObj ? empObj._id : []
        }).flat();
        
      
        const deptOptionsEl = this.props.departments.map(dept => {
            return (

                <Option key={dept._id} value={dept._id}>{dept.name}</Option>
            );
        })
        const employeeOptionsEl = this.state.employees.map(employee => {
            return (

                <Option key={employee._id} value={JSON.stringify(employee)}>{employee.name}</Option>
            );
        })
        const customersOptionsEl = this.props.customers.map(customer => {
            return (

                <Option key={customer._id} value={customer._id}>{customer.name}</Option>
            );
        })
        return (
            <Form id="editTicketForm" layout="vertical"
            hideRequiredMark
            ref={this.editTicketFormRef}
            onFinish={this.onEditTicket}
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
                    <Form.Item>
                    <Button form="editTicketForm" key="submit" type="primary" htmlType="submit" loading={this.state.submitBtnLoading}>
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
   );
    }
}

function mapStateToProps(state) {
    console.log(state);
    
    return {
        apiUrl: state.apiUrl,
        customers: state.customers,
        departments: state.departments,
        employees: state.employees,
    }
}

export default connect(mapStateToProps)(TicketEdit);