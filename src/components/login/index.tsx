import React from "react";
import "./index.sass"
export type PropsType = {
  cb: (l: boolean) => void
}
export default class extends React.Component<PropsType,{}> {
  constructor(props:PropsType){
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
}