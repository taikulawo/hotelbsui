import React from 'react'
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { connect } from 'react-redux'
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import User from './components/user';
import Consumer from './components/consumer';
import Home from './components/home'
import Staff from './components/staff';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
export default connect()(class extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <React.Fragment>
        <Router>
          <React.Fragment>
            <Layout style={{ minHeight: '100vh' }}>
              <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{
                background: '#304156'
              }}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{
                  userSelect: 'none'
                }} selectedKeys={[window.location.pathname]}>
                  <Menu.Item key="/">
                    <Link to="/">
                      <PieChartOutlined />
                      <span>主页</span>
                    </Link>
                  </Menu.Item>
                  <SubMenu
                    key="/user"
                    title={
                      <span>
                        <Link to="/user" style={{
                          display: 'block'
                        }}>
                          <PieChartOutlined />
                          <span>用户</span>
                        </Link>
                      </span>
                    }
                  >
                    <Menu.Item key="/user/consumers">
                      <Link to="/user/consumers">
                        <PieChartOutlined />
                        <span>旅客</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/user/staffs">
                      <Link to="/user/staffs">
                        <PieChartOutlined />
                        <span>员工</span>
                      </Link></Menu.Item>
                  </SubMenu>
                </Menu>
              </Sider>
              <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content style={{ margin: '0 16px' }}>
                  <Switch>
                    <Route path="/user" component={User} exact></Route>
                    <Route path="/user/consumers" component={Consumer}></Route>
                    <Route path="/user/staffs" component={Staff}></Route>
                    <Route path="/" component={Home}></Route>
                  </Switch>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Created by wuweichao</Footer>
              </Layout>
            </Layout>
          </React.Fragment>
        </Router>
      </React.Fragment>
    );
  }
})