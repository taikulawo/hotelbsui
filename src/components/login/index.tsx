import React, { useEffect } from "react";
import client, { STATUS_FAILED_NEED_LOGIN } from '../../api'
import "./index.sass"
import { message, Input } from "antd";
import { useObservable } from "../../util";
export type PropsType = {
  cb: (l: boolean) => void
  location: any
  history: any
}

export type StateType = {
  setLogin: (logined: boolean) => void
}

const isValidUser = (c: number): boolean => (STATUS_FAILED_NEED_LOGIN & c) === 0

export default function (props: PropsType) {
  const setLogin = props.cb
  const obj = useObservable({
    username: '',
    password: ''
  })
  function loginClick(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    // 这里处理登录相关的请求
    (async function () {
      let { code, data } = await client.apiGo("GET", client.apiUrl(`api/login?username=${obj.username}&password=${obj.password}`))
      if (!isValidUser(code)) {
        message.error({
          content: "账号密码不正确，请重新再试😅"
        })
        return
      }
      setLogin(true)
      let { from } = props.location.state || { from: { pathname: "/" } }
      props.history.replace(from)
    }())
  }
  useEffect(() => {
    (async function () {
      const { code } = await client.apiGo("GET", client.apiUrl("room"))
      if (!isValidUser(code)) {
        // need login
        message.error({
          content: "自动登录失败，你还没有登录😎"
        })
      }
    })()
  }, [])
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
                <Input className="user-input box-radius in sourcepro" onChange={i => obj.username = i.target.value}></Input>
              </div>
              <div className="box password-div">
                <label className="black-90 sourcepro in">密码</label>
                <Input type="password" className="user-input box-radius in sourcepro" onChange={i => obj.password = i.target.value}></Input>
              </div>
              <button className="user-input login-btn" onClick={e => loginClick(e)}>登录</button>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}

// export default class extends React.Component<PropsType, StateType> {
//   constructor(props: PropsType) {
//     super(props)
//     this.state = {
//       setLogin: props.cb
//     }
//   }
//   render() {
    // return (
    //   <div className="login-container">
    //     <main className="container box-radius">
    //       <header className="sourcepro">酒店管理系统</header>
    //       <div className="form-login">
    //         <section className="session">
    //           <form>
    //             <h2 className="sourcepro">登录</h2>
    //             <div className="box username-div">
    //               <label className="black-90 in sourcepro">用户名</label>
    //               <input className="user-input box-radius in sourcepro"></input>
    //             </div>
    //             <div className="box password-div">
    //               <label className="black-90 sourcepro in">密码</label>
    //               <input className="user-input box-radius in sourcepro"></input>
    //             </div>
    //             <button className="user-input login-btn" onClick={e => this.loginClick(e)}>登录</button>
    //           </form>
    //         </section>
    //       </div>
    //     </main>
    //   </div>
//     )
//   }
  // loginClick(e: React.FormEvent<HTMLButtonElement>) {
  //   e.preventDefault();
  // }
//   async componentDidMount() {
    // const { code } = await client.apiGo("GET", client.apiUrl("users"))
    // if ((code & STATUS_FAILED_NEED_LOGIN) !== 0) {
    //   // need login
    //   message.error({
    //     content: "自动登录失败，你还没有登录😎"
    //   })
    // }
//   }
// }