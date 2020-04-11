import React from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Modal, Form, Row, Col, Input, message, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


class Departments extends React.Component {

    constructor() {
        super();
        this.addDepartmentFormRef = React.createRef();
        this.editDepartmentFormRef = React.createRef();
        this.state = {
            addModalVisible: false,
            editModalVisible: false,
            editDepartmentLoading: false,
            addDepartmentLoading: false,
            departments: []
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
                                pathname: `/tickets/${record._id}`,
                                state: { department: record }
                            }}>Tickets</Link>
                        </div>

                    );
                }
            }
        ]
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

    fetchDepartments = () => {
        axios.get(`${this.props.apiUrl}/departments`, {
            headers: {
                'x-auth': localStorage.getItem('authToken')
            }
        })
            .then(response => {
                console.log(response, "DEPTOS8");
                this.setState(prevState => {
                    return {
                        departments: [...response.data]
                    }
                })
            })
            .catch(err => message.err(err.message));
    }

    componentDidMount() {
        console.log(this.props)
        this.fetchDepartments();

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
                this.setState(prevState => {
                    return {
                        departments: prevState.departments
                            .map(dept => {
                                if (dept._id === this.setActiveDeptId) {
                                    return { ...response.data }
                                }
                                return { ...dept }
                            }),
                            editModalVisible: false,
                            editDepartmentLoading: false
                    }
                })
            })
            .catch(err => console.log(err))

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
                    this.setState(prevState => {
                        return {
                            addDepartmentLoading: false,
                            addModalVisible: false,
                            departments: [...prevState.departments, response.data]
                        }
                    })
                }
                this.setState({ addDepartmentLoading: false });
            })
            .catch(err => {
                console.log(err);
                message.error(err.message);
                this.setState({ addDepartmentLoading: false });
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
                        dataSource={this.state.departments}
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
        apiUrl: state.apiUrl
    }
}

export default connect(mapStateToProps)(Departments);