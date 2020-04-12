import React from 'react';
import 'antd/dist/antd.css';
import { Drawer, Form, Row, Col, Input, Button, message } from 'antd';
import './App.css';
import { Route, Link } from 'react-router-dom';

import { Layout, Menu } from 'antd';
import { connect } from 'react-redux'
import * as setLoginAction from '../actions/setLoginAction';
import Customers from './Customers';
import CustomerEdit from './CustomerEdit';
import TicketCards from './TicketCards';
import Departments from './Departments';
import axios from 'axios';
import Employees from './Employees';
import Tickets from './Tickets';
import EmployeeEdit from './EmployeeEdit';
import TicketEdit from './TicketEdit';

const { Header, Content } = Layout;

class App extends React.Component {
    constructor() {
        super();
        console.log(this.props);

    }
    state = {
        drawerVisible: false,
        registerDrawerVisible: false,
        btnLoading: false
    }

    onClose = () => {
        this.setState({
            drawerVisible: false,
            registerDrawerVisible: false
        });
    };

    onFinish = (values) => {
        console.log("VAL", values, this.props);
        this.setState({ btnLoading: true })
        const { email, password } = values;
        axios.post(`${this.props.apiUrl}/users/login`, {
            email,
            password
        })
            .then(response => {
                this.setState({ btnLoading: false });
                if (response && response.data.error) {
                    message.error(response.data.error)
                }
                else {
                    message.success('Logging in');
                    localStorage.setItem('authToken', response.data.token);
                    
                    this.onClose();
                    this.props.dispatch(setLoginAction.setLoginActionTrue());
                    console.log(response, this.props);
                    this.props.history.push('/customers');

                }
            })
            .catch(err => {
                console.log(err);
                message.error(err.message);
                this.setState({ btnLoading: false });
            });

    }

    onRegisterFinish = (values) => {
        console.log("REGV", values, this.props);
        const { username, email, password } = values;
        this.setState({ btnLoading: true })
        axios.post(`${this.props.apiUrl}/users/register`, {
            username,
            email,
            password
        })
            .then(response => {
                console.log(response);
                this.setState({ btnLoading: false })
                message.success('Registered Successfully. Login to continue');
                this.onClose();
                this.setState({ drawerVisible: true })
            })
            .catch(err => {
                console.log(err);
                this.setState({ btnLoading: false })
                message.error(err.message);
            });
    }

    componentDidMount() {

        if (localStorage.getItem('authToken') && this.props.isLoggedIn === false) {
            this.props.dispatch(setLoginAction.setLoginActionTrue());
        }
        else if(this.props.isLoggedIn === false) {
            // this.props.dispatch(setLoginAction.setLoginActionFalse());
            this.props.history.push('/');
        }
    }

    logout = () => {
        console.log(this.props)
       axios.delete(`http://dct-ticket-master.herokuapp.com/users/logout`, {
           headers: {
               'x-auth': localStorage.getItem('authToken')
           }
       })
       .then(response => {
           console.log(response);
           this.props.history.push('/');
           this.props.dispatch(setLoginAction.setLoginActionFalse());
       })
       .catch(err => console.log(err)
       )
    }

    render() {
        
        const navEl = (
            this.props.isLoggedIn ?
                (
                    <div>
                        <Menu theme="dark" mode="horizontal" style={{ float: 'right' }} defaultSelectedKeys={['1']}>
                            <Menu.Item key="1"><Link to="/home">Home</Link></Menu.Item>
                            <Menu.Item key="2"><Link to="/customers">Customers</Link></Menu.Item>
                            <Menu.Item key="3"><Link to="/departments">Departments</Link></Menu.Item>
                            <Menu.Item key="4"><Link to="/employees">Employees</Link></Menu.Item>
                            <Menu.Item key="5"><Link to="/tickets">Tickets</Link></Menu.Item>
                            <Menu.Item key="6" onClick={this.logout}>Logout</Menu.Item>
                        </Menu>
                    </div>
                )
                :
                (
                    <div>
                        <Menu theme="dark" mode="horizontal" style={{ float: 'right' }} defaultSelectedKeys={['1']}>
                            <Menu.Item key="1"><Link to="/home">Home</Link></Menu.Item>
                            <Menu.Item key="2" onClick={_ => this.setState({ drawerVisible: true })}>Login</Menu.Item>
                            <Menu.Item key="3" onClick={_ => this.setState({ registerDrawerVisible: true })}>Register</Menu.Item>
                        </Menu>
                    </div>
                )
        );

        const contentEl = (
         (this.props.location.pathname == '/' || this.props.location.pathname == '/home') ? 
            (
                <div>
                    <Drawer
                            title="Login"
                            placement="right"
                            width="420px"
                            onClose={this.onClose}
                            visible={this.state.drawerVisible}
                        >
                            <div></div>
                            <Form layout="vertical"
                                hideRequiredMark
                                onFinish={this.onFinish}
                            >
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
                                            name="password"
                                            label="Password"
                                            rules={[{ required: true, message: 'Please enter password' }]}
                                        >
                                            <Input.Password placeholder="Enter Password" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row >
                                    <Form.Item >
                                        <Button type="primary" loading={this.state.btnLoading} htmlType="submit">
                                            Submit
                        </Button>
                                    </Form.Item>

                                </Row>
                            </Form>
                        </Drawer>

                        <Drawer
                            title="Register"
                            placement="right"
                            width="420px"
                            onClose={this.onClose}
                            visible={this.state.registerDrawerVisible}
                        >
                            <div></div>
                            <Form layout="vertical"
                                hideRequiredMark
                                onFinish={this.onRegisterFinish}
                            >
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="username"
                                            label="Username"
                                            rules={[{ required: true, message: 'Please enter username' }]}
                                        >
                                            <Input placeholder="Please enter username" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="email"
                                            label="Email"
                                            rules={[{ required: true, message: 'Please enter email' }]}
                                        >
                                            <Input placeholder="Please enter email" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item
                                            name="password"
                                            label="Password"
                                            rules={[{ required: true, message: 'Please enter password' }]}
                                        >
                                            <Input.Password placeholder="Enter Password" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row >
                                    <Form.Item >
                                        <Button type="primary" loading={this.state.btnLoading} htmlType="submit">
                                            Submit
                        </Button>
                                    </Form.Item>

                                </Row>
                            </Form>
                        </Drawer>


                        <div className="site-layout-content" style={{ display: 'flex', justifyContent: 'center', padding: '15px 0', width: '100%' }}>
                            <img src="http://ticket-master-app-aman.herokuapp.com/static/media/image.402c825e.png" />
                        </div>
                </div>
            )
            : ''
        );


        return (

            <div>
              
                <Layout className="layout">
                    <Header style={{ height: '39px', lineHeight: '39px' }}>
                        <Link to="/home">
                            <div className="logo" style={{ float: 'left' }}>
                                <img src="http://ticket-master-app-aman.herokuapp.com/static/media/image.402c825e.png" />
                                <h2>Ticketmaster</h2>
                            </div>

                        </Link>
                        {navEl}
                    </Header>
                    <Content style={{ minHeight: 'calc(100vh - 61px)', width: '100%', backgroundColor: 'rgb(255, 255, 255)', display: 'flex' }}>
                    {contentEl}
                        <Route path="/customers" exact component={Customers} />
                        <Route path="/departments" exact component={Departments} />
                        <Route path="/employees" exact component={Employees} />
                        <Route path="/tickets" exact component={Tickets} />
                        <Route path="/customers/edit/:id" exact component={CustomerEdit} />
                        <Route path="/employees/edit/:id" exact component={EmployeeEdit} />
                        <Route path="/tickets/edit/:id" exact component={TicketEdit} />
                        <Route path="/users/tickets" exact component={TicketCards} />
                    </Content>
                    {/* <Footer theme="dark" style={{ textAlign: 'center', color: 'white', padding: '0px', backgroundColor: '#001529' }}>Ticketmaster</Footer> */}
                </Layout>

            </div>


        );
    }


}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.isLoggedIn,
        apiUrl: state.apiUrl
    }
}

export default connect(mapStateToProps)(App);