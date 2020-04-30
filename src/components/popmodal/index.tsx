import React from 'react'
import { Modal, Form, Select, Input, InputNumber } from "antd";
import { Rule } from 'antd/lib/form';
const { Option } = Select

export type item = {
  name: string
  label: string
  rules: Array<Rule>
  render: () => {}
}
export type PopModalPropsType = {
  modalVisiable: boolean
  handleOk: () => {}
  handleCancel: () => {}
  confirmLoading: boolean
  items: Array<item>
}

export type PopMpdalStateType = {

}

export default class extends React.Component<PopModalPropsType, PopMpdalStateType> {
  constructor(props: PopModalPropsType) {
    super(props)
  }
  prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  )
  render() {
    return (
      <Modal visible={this.props.modalVisiable} title="添加旅客" onOk={this.props.handleOk} onCancel={this.props.handleCancel} confirmLoading={this.props.confirmLoading}>
        <Form {...formItemLayout}>
          <Form.Item name="username" label="姓名" rules={[
            {
              required: true,
              message: "输入用户名"
            }
          ]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="电子邮箱" rules={[
            {
              required: true,
              message: "输入电子邮箱"
            }, {
              type: 'email',
              message: "不是一个合法的电子邮件地址"
            }
          ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input addonBefore={this.prefixSelector} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="roomnum"
            label="房间号"
            rules={[{ required: true, message: '请输入房间号' }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name="roomtypeid"
            label="房间类型"
            rules={[{ required: true, message: "请选择房间类型" }]}
          >
            <Select>
              {

              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};