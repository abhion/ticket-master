import React from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Modal, Form, Row, Col, Input, message, Table, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Option } = Select;
class Employees extends React.Component {

    constructor() {
        super();
        this.addEmployeeFormRef = React.createRef();
        this.state = {
            addModalVisible: false,
            addEmployeeLoading: false,
            employees: [],
            departments: []
        }
        this.tableColumns = [
            { title: 'Name', dataIndex: 'name', key: 1 },
            { title: 'Email', dataIndex: 'email', key: 2 },
            { title: 'Mobile', dataIndex: 'mobile', key: 3 },
            { title: 'Department', 
                render: (text, record) => {
                    console.log(text, record);
                    return <>{record.department.name}</>
                }
            , key: 4 },
            {
                key: 4,
                title: 'Action',
                render: (text, record) => {
                    return (
                        <div>
                            <Link to={{
                                pathname: `/employees/edit/${record._id}`,
                                state: { employee: record }
                            }}>Edit | </Link>
                            <Link to={{
                                pathname: `/tickets/${record._id}`,
                                state: { employee: record }
                            }}>Tickets</Link>
                        </div>

                    );
                }
            }
        ]
    }

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
            .catch(err => message.error(err.message));
    }

    fetchEmployees = () => {
        axios.get(`http://dct-ticket-master.herokuapp.com/employees`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response, "Empos");
                this.setState(prevState => {
                    return {
                        employees: [...response.data]
                    }
                })
            })
            .catch(err => message.error(err.message));
    }

    componentDidMount() {
        console.log(this.props)
        this.fetchEmployees();
        this.fetchDepartments();
    }

    handleFormFieldsReset = () => {
        setTimeout(() => {
            this.addEmployeeFormRef.current.resetFields()
        }, 20);
    }

    onAddEmployee = (values) => {
        console.log(values, "CuA");
        const { name, email, mobile, department } = values;
        this.setState({ addEmployeeLoading: true });
        axios.post(`${this.props.apiUrl}/employees`, {
            name, email, mobile, department
        }, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response);
                if (response && response.data.error) {
                    message.error(response.data.error);
                    this.setState({ addEmployeeLoading: false });
                }
                else {
                    this.setState(prevState => {
                        return {
                            addEmployeeLoading: false,
                            addModalVisible: false,
                            employees: [...prevState.employees, response.data]
                        }
                    })
                }
                this.setState({ addEmployeeLoading: false });
            })
            .catch(err => {
                console.log(err);
                message.error(err.message);
                this.setState({ addEmployeeLoading: false });
            })
    }

    render() {
        const optionsEl = this.state.departments.map(dept => {
            return (
                    <Option key={dept._id} value={dept._id}>{dept.name}</Option>
            );
        })
        return (
            <div className="content-container">
                <div className="container-header">
                    <h2>Employees  </h2>
                    <Button type="primary" icon={<PlusOutlined />}
                        onClick={() => this.setState({ addModalVisible: true }, () => this.handleFormFieldsReset())}>

                        Add Employee
                    </Button>
                </div>
                <div>
                    <Table
                        columns={this.tableColumns}
                        dataSource={this.state.employees}
                        rowKey="_id"
                    />
                </div>
                {/* <Divider style={{width: '97%', minWidth: '97%', margin: 'auto'}} /> */}
                <Modal
                    title="Add Employee"
                    centered
                    visible={this.state.addModalVisible}
                    onCancel={() => this.setState({ addModalVisible: false })}
                    footer={[
                        <Button key="back" onClick={() => this.setState({ addModalVisible: false })}>
                            Cancel
                        </Button>,
                        <Button form="addEmployeeForm" key="submit" type="primary" htmlType="submit" loading={this.state.addEmployeeLoading}>
                            Submit
                        </Button>,
                    ]}
                >

                    <Form id="addEmployeeForm" layout="vertical"
                        hideRequiredMark
                        ref={this.addEmployeeFormRef}
                        onFinish={this.onAddEmployee}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    name="name"
                                    label="Employee name"
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
                        <Row gutter={16}>
                            <Col span={24}>
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
        apiUrl: state.apiUrl
    }
}

export default connect(mapStateToProps)(Employees);