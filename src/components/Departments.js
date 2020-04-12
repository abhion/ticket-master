import React from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Modal, Form, Row, Col, Input, message, Table, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as departmentsAction from '../actions/departmentsAction';
import {setLoginActionFalse} from '../actions/setLoginAction';

class Departments extends React.Component {

    constructor() {
        super();
        this.addDepartmentFormRef = React.createRef();
        this.editDepartmentFormRef = React.createRef();
        this.state = {
            addModalVisible: false,
            editModalVisible: false,
            editDepartmentLoading: false,
            addDepartmentLoading: false
        }
        this.tableColumns = [
            { title: 'Name', dataIndex: 'name', key: 1 },
            {
                key: 4,
                title: 'Action',
                render: (text, record) => {
                    return (
                        <div>
                            <a onClick={() => this.showEditDialog(record)}>Edit | </a>
                            <Link to={{
                                pathname: `/users/tickets`,
                                state: { department: record },
                                search: `?department=${record._id}`
                            }}>Tickets | </Link>
                             <Popconfirm
                                placement="right"
                                key={record._id}
                                title="Are you sure?"
                                onConfirm={(ev) => this.deleteDepartment(ev, record)}
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

    deleteDepartment = (d, dept) => {
        console.log(d, dept);
        axios.delete(`http://dct-ticket-master.herokuapp.com/departments/${dept._id}`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response, "DOLAFE");
                if(response.data._id){
                    message.success('Deleted');
                }
                this.props.dispatch(departmentsAction.startGetDepartments());
            })
            .catch(err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err));
    }

    showEditDialog(department) {
        console.log(department, "SELECTEDepa");
        this.setActiveDeptId = department._id;
        this.setState({
            editModalVisible: true
        })
        setTimeout(() => {
            this.editDepartmentFormRef.current.setFieldsValue({
                name: department.name
            });
        }, 100);


    }

    

    handleFormFieldsReset = () => {
        setTimeout(() => {
            this.addDepartmentFormRef.current.resetFields()
        }, 20);
    }

    onEditDepartment = (values) => {
        const { name } = values;
        this.setState({editDepartmentLoading: true})
        axios.put(`${this.props.apiUrl}/departments/${this.setActiveDeptId}`, {
            name
        }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response);
               this.props.dispatch(departmentsAction.startGetDepartments());
               message.success('Updated');
               this.setState({
                   editDepartmentLoading: false,
                   editModalVisible: false
               })
            })
            .catch(err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err));

    }

    onAddDepartment = (values) => {
        console.log(values, "CuA");
        const { name } = values;
        this.setState({ addDepartmentLoading: true });
        axios.post(`${this.props.apiUrl}/departments`, {
            name
        }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response);
                if (response && response.data.error) {
                    message.error(response.data.error);
                    this.setState({ addDepartmentLoading: false });
                }
                else {
                    this.props.dispatch(departmentsAction.startGetDepartments());
                    this.setState({ addDepartmentLoading: false, addModalVisible: false });
                }
            })
            .catch(err => {
                console.log(err);
                message.error(err.message);
                this.setState({ addDepartmentLoading: false });
                return err => err.message == 'Request failed with status code 401' ? this.props.dispatch(setLoginActionFalse()) : console.log(err);
            })
    }

    render() {
        return (
            <div className="content-container">
                <div className="container-header">
                    <h2>Departments  </h2>
                    <Button type="primary" icon={<PlusOutlined />}
                        onClick={() => this.setState({ addModalVisible: true }, () => this.handleFormFieldsReset())}>

                        Add Department
                    </Button>
                </div>
                <div>
                    <Table
                        columns={this.tableColumns}
                        dataSource={this.props.departments}
                        pagination={{ pageSize: 6 }}
                        rowKey="_id"
                        bordered
                    />
                </div>
                {/* <Divider style={{width: '97%', minWidth: '97%', margin: 'auto'}} /> */}
                <Modal
                    title="Add Department"
                    centered
                    visible={this.state.addModalVisible}
                    onCancel={() => this.setState({ addModalVisible: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ addModalVisible: false })}>
                            Cancel
                        </Button>,
                        <Button form="addDepartmentForm" key="submit" type="primary" htmlType="submit" loading={this.state.addDepartmentLoading}>
                            Submit
                        </Button>,
                    ]}
                >

                    <Form id="addDepartmentForm" layout="vertical"
                        hideRequiredMark
                        ref={this.addDepartmentFormRef}
                        onFinish={this.onAddDepartment}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label="Department name"
                                    rules={[{ required: true, message: 'Please enter department name' }]}
                                >
                                    <Input placeholder="Please enter department name" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
                <Modal
                    title="Edit Department details"
                    centered
                    visible={this.state.editModalVisible}
                    onCancel={() => this.setState({ editModalVisible: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ editModalVisible: false })}>
                            Cancel
                        </Button>,
                        <Button form="editDepartmentForm" key="submit" type="primary" htmlType="submit" loading={this.state.editDepartmentLoading}>
                            Submit
                        </Button>,
                    ]}
                >

                    <Form id="editDepartmentForm" layout="vertical"
                        hideRequiredMark
                        ref={this.editDepartmentFormRef}
                        onFinish={this.onEditDepartment}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label="Department name"
                                    rules={[{ required: true, message: 'Please enter department name' }]}
                                >
                                    <Input placeholder="Please enter department name" />
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
        departments: state.departments
    }
}

export default connect(mapStateToProps)(Departments);