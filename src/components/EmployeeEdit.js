import React from 'react';
import { Row, Col, Form, Input, Button, message, Select } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import {startGetEmployees} from '../actions/employeesAction';
import {setLoginActionFalse} from '../actions/setLoginAction';
const { Option } = Select;

class EmployeeEdit extends React.Component {
    edFormRef = React.createRef();
    _id = null;
  
    constructor() {
        super();
        this.state = {
            submitBtnLoading: false,
            departments: []
        }
    }

    componentDidMount() {
        console.log(this.props.location.state.employee, "this.props.location.state.employee;");

        const { name, mobile, email, department: { _id: _deptId }, department } = this.props.location.state.employee;
        
        this.fetchDepartments();
        [this.name, this.email, this.mobile, this.deptId] = [name, email, mobile, _deptId ? _deptId : department ];
        console.log(this.deptId);
        this._id = this.props.location.state.employee._id;
        this.edFormRef.current.setFieldsValue({
            name, email, mobile, department: this.deptId
        });

    }

    componentWillUnmount() {
        this.props.history.replace({ pathname: '', state: {} })
    }

    onFinish = values => {
        console.log(values);
        const { name, email, mobile, department } = values;
        this.setState({submitBtnLoading: true})
        axios.put(`${this.props.apiUrl}/employees/${this._id}`, {
            name, email, mobile, department
        }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                const history = createHistory();
                message.success('Updated');
                this.setState({submitBtnLoading: false})
                if (history.location.state && history.location.state.employee) {
                    let state = { ...history.location.state };
                    delete state.employee;
                    history.replace({ ...history.location, ...{ state: { employee: response.data } } });
                    console.log(this.props.location, "FPa");
                    this.props.dispatch(startGetEmployees());
                }
            })
            .catch(err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err));

    };

    fetchDepartments = () => {
        axios.get(`http://dct-ticket-master.herokuapp.com/departments`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response, "dep");
                this.setState(prevState => {
                    return {
                        departments: [...response.data]
                    }
                })
            })
            .catch(err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err));
    }

    onReset = () => {
        this.edFormRef.current.resetFields();
    };

    onFill = () => {
        this.edFormRef.current.setFieldsValue({
            note: 'Hello world!',
            gender: 'male',
        });
    };

    render() {
        const optionsEl = this.state.departments.map(dept => {
            return (
                <Option key={dept._id} value={dept._id}>{dept.name}</Option>
            );
        })
        return (
            <Form ref={this.edFormRef} onFinish={this.onFinish}>

                <Form.Item
                    name="name"
                    label="Employee name"
                    rules={[{ required: true, message: 'Please enter name' }]}
                >
                    <Input placeholder="Please enter name" />
                </Form.Item>


                <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: "email", message: 'Please enter email' }]}
                >
                    <Input placeholder="Please enter email" />
                </Form.Item>


                <Form.Item
                    name="mobile"
                    label="Mobile"
                    rules={[{ required: true, message: 'Please enter 10 digit number', len: 10 }]}
                >
                    <Input placeholder="Enter Phone number" />
                </Form.Item>
                <Form.Item
                    name="department"
                    label="Department"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        placeholder="Select a option">
                        {optionsEl}
                    </Select>
                </Form.Item>
                <Form.Item   >
                    <Button type="primary" loading={this.state.submitBtnLoading} htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        );
    }
}

function mapStateToProps(state) {
    return {
        apiUrl: state.apiUrl
    }
}

export default connect(mapStateToProps)(EmployeeEdit);