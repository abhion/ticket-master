import React from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { connect } from 'react-redux';
import createHistory from 'history/createBrowserHistory'

import {setLoginActionFalse} from '../actions/setLoginAction';
import {startGetCustomers} from '../actions/customersAction'

class CustomerEdit extends React.Component {
    edFormRef = React.createRef();
    _id = null;
    onGenderChange = value => {
        this.edFormRef.current.setFieldsValue({
            note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
        });
    };

    constructor() {
        super();
        this.state = {
            submitBtnLoading: false
        }
    }

    componentDidMount() {
        const { name, mobile, email } = this.props.location.state.customer;
        [this.name, this.email, this.mobile] = [name, email, mobile];
        console.log(this.name);
        console.log(this.props.location, "FPa");
        this._id = this.props.location.state.customer._id;
        this.edFormRef.current.setFieldsValue({
            name, email, mobile
        });
    }

    componentWillUnmount() {
        this.props.history.replace({ pathname: '', state: {} })
    }

    onFinish = values => {
        console.log(values);
        const { name, email, mobile } = values;
        this.setState({submitBtnLoading: true})
        axios.put(`${this.props.apiUrl}/customers/${this._id}`, {
            name, email, mobile
        }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {

                this.props.location.state = { ...response.data };
                this.props.dispatch(startGetCustomers());
                this.setState({submitBtnLoading: false})
                const history = createHistory();
                message.success('Updated');
                if (history.location.state && history.location.state.customer) {
                    let state = { ...history.location.state };
                    delete state.customer;
                    history.replace({ ...history.location, ...{ state: { customer: response.data } } });
                    console.log(this.props.location, "FPa");

                }
            })
            .catch(err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err));

    };

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
        return (
            <Form ref={this.edFormRef} onFinish={this.onFinish}>
                
                        <Form.Item
                            name="name"
                            label="Customer name"
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

export default connect(mapStateToProps)(CustomerEdit);