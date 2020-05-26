import React from "react";
import client, { STATUS_FAILED_NEED_LOGIN } from '../../api'
import "./index.sass"
import { message } from "antd";
export type PropsType = {
  cb: (l: boolean) => void
}
export default class extends React.Component<PropsType, {}> {
  constructor(props: PropsType) {
    super(props)
  }
  render() {
    return (
      <div className="login-container">
        <main className="container box-radius">
          <header className="sourcepro">酒店管理系统</header>
          <div className="form-login">
            <section className="session">
              <form>
                <h2 className="sourcepro">登录</h2>
                <div className="box username-div">
                  <label className="black-90 in sourcepro">用户名</label>
                  <input className="user-input box-radius in sourcepro"></input>
                </div>
                <div className="box password-div">
                  <label className="black-90 sourcepro in">密码</label>
                  <input className="user-input box-radius in sourcepro"></input>
                </div>
                <button className="user-input login-btn" onClick={e => this.loginClick(e)}>登录</button>
              </form>
            </section>
          </div>
        </main>
      </div>
    )
  }
  loginClick(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
  }
  async componentDidMount() {
    const { code, data } = await client.apiGo("GET", client.apiUrl("/users"))
    if ((code & STATUS_FAILED_NEED_LOGIN) !== 0) {
      // need login
      message.error({
        content: "自动登录失败，你还没有登录😎"
      })
    }
  }
}