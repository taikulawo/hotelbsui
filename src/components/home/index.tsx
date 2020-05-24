import React, { CSSProperties } from 'react'

export default class extends React.Component {
  render() {
    return (
      <div className="container">
        <div style={styles}>欢迎使用</div>
        <br />
        <div style={styles}>西瓜酒店管理系统</div>
      </div>
    )
  }
}

const styles: CSSProperties = {
  "textAlign": "center",
  'fontSize': '36px'
}