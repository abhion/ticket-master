import React from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Modal, Form, Row, Col, Input, message, Table, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'; 
import { setLoginActionFalse } from '../actions/setLoginAction'
import * as customersAction from '../actions/customersAction';


class Customers extends React.Component {

    constructor() {
        super();
        this.addCustomerFormRef = React.createRef();
        this.state = {
            addModalVisible: false,
            addCustomerLoading: false
        }
        this.tableColumns = [
            { title: 'Name', dataIndex: 'name', key: 1 },
            { title: 'Email', dataIndex: 'email', key: 2 },
            { title: 'Mobile', dataIndex: 'mobile', key: 3 },
            {
                key: 4,
                title: 'Action',
                render: (text, record) => {
                    
                    return (
                        <div>
                            <Link to={{
                                pathname: `/customers/edit/${record._id}`,
                                state: { customer: record }
                            }}>Edit | </Link>
                            <Link to={{
                                pathname: `/users/tickets`,
                                state: { customer: record },
                                search: `?customer=${record._id}`
                            }}>Tickets | </Link>
                            <Popconfirm
                                placement="right"
                                key={record._id}
                                title="Are you sure?"
                                onConfirm={(ev) => this.deleteCustomer(ev, record)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <span className="link-text"> Delete</span>
                            </Popconfirm>
                        </div>

                    );
                }
            }
        ]
    }

    deleteCustomer = (d, customer) => {
        console.log(d, customer);
        axios.delete(`http://dct-ticket-master.herokuapp.com/customers/${customer._id}`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response, "DOLAFE");
                if (response.data._id) {
                    message.success('Deleted');
                }
                this.props.dispatch(customersAction.startGetCustomers());
            })
            .catch(err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err));
    }


    handleFormFieldsReset = () => {
        setTimeout(() => {
            this.addCustomerFormRef.current.resetFields()
        }, 20);
    }

    onAddCustomer = (values) => {
        console.log(values, "CuA");
        const { name, email, mobile } = values;
        this.setState({ addCustomerLoading: true });
        axios.post(`${this.props.apiUrl}/customers`, {
            name, email, mobile
        }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response);
                if (response && response.data.error) {
                    message.error(response.data.error);
                    this.setState({ addCustomerLoading: false });
                }
                else {
                    this.props.dispatch(customersAction.startGetCustomers());
                    this.setState({ addCustomerLoading: false, addModalVisible: false });
                }
            })
            .catch(err => {
                console.log(err);
                message.error(err.message);
                this.setState({ addCustomerLoading: false });
                return err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err)
            })
    }

    render() {
        return (
            <div className="content-container">
                <div className="container-header">
                    <h2>Customers  </h2>
                    <Button type="primary" icon={<PlusOutlined />}
                        onClick={() => this.setState({ addModalVisible: true }, () => this.handleFormFieldsReset())}>

                        Add Customer
                    </Button>
                </div>
                <div>
                    <Table
                        columns={this.tableColumns}
                        dataSource={this.props.customers}
                        rowKey="_id"
                        pagination={{ pageSize: 6 }}
                        bordered
                    />
                </div>
                {/* <Divider style={{width: '97%', minWidth: '97%', margin: 'auto'}} /> */}
                <Modal
                    title="Add Customer"
                    centered
                    visible={this.state.addModalVisible}
                    onCancel={() => this.setState({ addModalVisible: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ addModalVisible: false })}>
                            Cancel
                        </Button>,
                        <Button form="addCustomerForm" key="submit" type="primary" htmlType="submit" loading={this.state.addCustomerLoading}>
                            Submit
                        </Button>,
                    ]}
                >

                    <Form id="addCustomerForm" layout="vertical"
                        hideRequiredMark
                        ref={this.addCustomerFormRef}
                        onFinish={this.onAddCustomer}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label="Customer name"
                                    rules={[{ required: true, message: 'Please enter name' }]}
                                >
                                    <Input placeholder="Please enter name" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="email"
                                    label="Email"
                                    rules={[{ required: true, type: "email", message: 'Please enter email' }]}
                                >
                                    <Input placeholder="Please enter email" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="mobile"
                                    label="Mobile"
                                    rules={[{ required: true, message: 'Please enter 10 digit number', len: 10 }]}
                                >
                                    <Input placeholder="Enter Phone number" />
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
    return {
        apiUrl: state.apiUrl,
        customers: state.customers
    }
}

export default connect(mapStateToProps)(Customers);