import React, { useEffect } from "react";
import client, { STATUS_FAILED_NEED_LOGIN } from '../../api'
import "./index.sass"
import { message, Input, notification } from "antd";
import { SmileOutlined } from '@ant-design/icons';
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
const DEFAULT_JWT_TOKEN = 'jwt_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1am4tYnMtc2VydmVyIn0.nArVsN2xlbwjFEFqVCIwxOK-uBXCoyfwX1Cer2-cvcQ; Path=/; Domain=apibs.chaochaogege.net'
export default function (props: PropsType) {
  const setLogin = props.cb
  const obj = useObservable({
    username: '',
    password: ''
  })

  async function showSuccess() {
    await message.loading("登录成功，正在跳转", 1)
    await message.success("登录成功😀", 1)
  }
  function toPanel(path: string = "/") {
    setLogin(true)
    let { from } = { from: { pathname: path } }
    props.history.replace(from)
  }
  function loginClick(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault();
    // 这里处理登录相关的请求
    (async function () {
      if ("testuser" === obj.username && "testpassword" === obj.password) {
        // document.cookie = DEFAULT_JWT_TOKEN
        await showSuccess()
        toPanel()
        CookieHelper.add("jwt_token", DEFAULT_JWT_TOKEN)
        notification.open({
          message: '注意',
          description:
            "你使用的是测试账号，受限于Set-Cookie的设置策略，无法跨域设置TOKEN来访问被保护的API接口" +
            "。\n当你接下来点击响应的管理面板时，由于没有对应的权限，前端获取不到数据，页面可能会崩溃",
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          duration: null
        });
        return
      }
      let { code, data } = await client.apiGo("GET", client.apiUrl(`login?username=${obj.username}&password=${obj.password}`))
      if (!isValidUser(code)) {
        message.error({
          content: "账号密码不正确，请重新再试😅"
        })
        return
      }
      await showSuccess()
      toPanel()
      if (!Array.isArray(data)) {
        CookieHelper.add("jwt_token", data["jwt_token"])
      } else {
        console.error(`Isn't a Object ${data}`, data)
      }
    }())
  }
  useEffect(() => {
    if (CookieHelper.has("jwt_token")) {
      // 自动登录进去
      toPanel()
    }
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

class CookieHelper {
  private static cookieObj = document.cookie.split(";")
    .reduce((prev: any, next) => {
      const o = next.split("=")
      prev[o[0]] = o[1]
      return prev
    }, {})
  constructor() {

  }
  static add(key: string, v: string) {
    CookieHelper.cookieObj[key] = v
  }
  static del(key: string) {
    delete CookieHelper.cookieObj[key]
  }
  static has(key: string) {
    return typeof CookieHelper.cookieObj[key] !== 'undefined'
  }
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