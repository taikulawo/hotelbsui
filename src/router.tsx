import React from 'react'
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
} from '@ant-design/icons';
import { createBrowserHistory } from 'history'
import User from './components/user';
import Consumer from './components/consumer';
import Home from './components/home'
import Staff from './components/staff';
import Room from './components/room';
import Login from './components/login'
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export type PropsType = {}
export type StateType = {
  collapsed: boolean
  hasLogined: boolean,
  to: string
}

class router extends React.Component<any, StateType> {
  constructor(props: any) {
    super(props)
    let isLg = false
    if (localStorage.getItem("jwt_token") !== null) {
      isLg = true
    }
    this.state = {
      collapsed: false,
      hasLogined: isLg,
      to: '/'
    };
    
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };
  setLogin(l: boolean) {
    this.setState({
      ...this.state,
      hasLogined: l
    })
  }
  ProtectedRouter = ({ children, ...rest }: any) => {
    return (
      <Route {...rest} render={({ location }) =>
        this.state.hasLogined ? (
          children
        ) : (
            <Redirect to={{
              pathname: "/login",
              state: {
                from: location
              }
            }}></Redirect>
          )
      }>
      </Route>
    )
  }
  render() {
    return (
      <Router>
        <Switch>
          {
            this.state.hasLogined || (
              <Route exact path="/login" render={p => <Login {...p} cb={c => this.setLogin(c)}></Login>}>
              </Route>)
          }
          <this.ProtectedRouter>
            <Layout style={{ minHeight: '100vh' }}>
              <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{
                background: '#304156'
              }}>
                <div className="logo" />
                <Menu theme="dark" defaultOpenKeys={["/user"]} selectedKeys={[this.state.to]} mode="inline" style={{
                  userSelect: 'none',
                  paddingTop: '64px'
                }}>
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
                        <span>入住旅客</span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/user/staffs">
                      <Link to="/user/staffs">
                        <PieChartOutlined />
                        <span>酒店员工</span>
                      </Link>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="/room">
                    <Link to="/room">
                      <PieChartOutlined />
                      <span>房间类型</span>
                    </Link>
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
                <Content className="display-content" style={{ margin: '0 16px' }}>
                  <Switch>
                    <this.ProtectedRouter path="/user" exact>
                      <User></User>
                    </this.ProtectedRouter>
                    <this.ProtectedRouter path="/user/consumers" exact>
                      <Consumer></Consumer>
                    </this.ProtectedRouter>
                    <this.ProtectedRouter path="/user/staffs" exact>
                      <Staff></Staff>
                    </this.ProtectedRouter>
                    <this.ProtectedRouter path="/" exact>
                      <Home></Home>
                    </this.ProtectedRouter>
                    <this.ProtectedRouter exact path="/room">
                      <Room></Room>
                    </this.ProtectedRouter>
                  </Switch>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Created by wuweichao</Footer>
              </Layout>
            </Layout>
          </this.ProtectedRouter>
        </Switch>
      </Router>
    );
  }
  shouldComponentUpdate(nextProps: PropsType, nextState: StateType) {
    return this.state.hasLogined !== nextState.hasLogined
  }
}
export default connect()(router)

