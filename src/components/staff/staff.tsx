import { Button, Form, Input, InputNumber, Modal, Select, Space, Spin, Table } from 'antd'
import { TableRowSelection } from 'antd/lib/table/interface'
import React from 'react'
import api from '../../api'
import { ActionTypeOfUser, Staffs, ID } from '../../store/reducers/user'
import { convertToColumn, convertToDataSource, useObservable } from '../../util'
import { PropsType } from './types'
const { Option } = Select
type StateType = {
  dataSource: Array<{ [key: string]: string }>
  columns?: any[]
  selectedRowKeys: ID[]
  loading: boolean,
  modalVisiable: boolean,
  confirmLoading: false,
  inputValue: any
}

/**
 * React.Component.props.childrens不一定会存在
 * 只有上层注入childrens时才会存在(作为容器)
 * 所以使用typescript时需要重新定义类型注入
 */
export default class extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props)
    this.state = {
      dataSource: [],
      selectedRowKeys: [],
      loading: false,
      modalVisiable: false,
      confirmLoading: false,
      inputValue: {
        username: '',
        email: '',
        phone: ''
      }
    }
  }

  onSelectChange(selectedRowKeys: ID[]) {
    this.setState({ ...this.state, selectedRowKeys });
  }

  deleteRows = async () => {
    this.setState({
      ...this.state,
      loading: true
    })
    let source = this.state.dataSource
    for (let i = 0; i < source.length; i++) {
      if (source[i]['id'] in this.state.selectedRowKeys) {
        source.splice(i, 1)
      }
    }
    const promises = this.state.selectedRowKeys.map(async id => {
      await api.deleteSingle('staff', id)
    })
    await Promise.all(promises)
    await this.fetchStaffs()
    this.setState({
      ...this.state,
      dataSource: source,
      selectedRowKeys: [],
      loading: false
    })
  }

  addRow = async () => {
    this.toggleModal(true)
  }

  toggleModal(ok: boolean) {
    this.setState({
      ...this.state,
      modalVisiable: ok
    })
  }

  handleModalOk = async () => {
    await api.insert('staff', {
      ...this.state.inputValue
    })
    this.toggleModal(false)
  }
  handleModalCancel = async () => {
    this.setState({
      ...this.state,
      modalVisiable: false,
      confirmLoading: false
    })
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
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange.bind(this)
    } as TableRowSelection<any>;
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Space direction="vertical" style={{
            width: '100%'
          }}>
            <div className="table-control">
              <Space>
                <Button type="primary" onClick={this.addRow}>添加</Button>
                <Button type="danger" onClick={this.deleteRows}>删除</Button>
              </Space>
            </div>
            <Table rowSelection={rowSelection} columns={this.state.columns} dataSource={this.state.dataSource} bordered>
            </Table>
            <Modal visible={this.state.modalVisiable} title="添加员工" onOk={this.handleModalOk} onCancel={this.handleModalCancel} confirmLoading={this.state.confirmLoading}>
              <Form {...formItemLayout}>
                <Form.Item name="username" label="姓名" rules={[
                  {
                    required: true,
                    message: "输入用户名"
                  }
                ]}>
                  <Input onChange={i => this.state.inputValue.username = i.target.value} />
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
                  <Input type="email" onChange={i => this.state.inputValue.email = i.target.value} />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                  <Input addonBefore={this.prefixSelector} onChange={i => this.state.inputValue.phone} style={{ width: '100%' }} />
                </Form.Item>
              </Form>
            </Modal>
          </Space>
        </Spin>
      </React.Fragment>
    )
  }

  async componentDidMount() {
    await this.fetchColumns()
    await this.fetchStaffs()
    const dsource = convertToDataSource(this.props.staffs.columns, 'id')
    const cols = convertToColumn(this.props.staffs.columns_name, 'id')
    this.setState(({
      ...this.state,
      columns: cols,
      dataSource: dsource
    }))
  }


  async componentDidUpdate() {
    // await this.fetchStaffs()
  }

  async fetchStaffs() {
    let { data } = await api.queryAll('staff')
    this.props.dispatch({
      type: ActionTypeOfUser.SET_STAFFS_COLUMNS,
      data: {
        columns: data as Staffs
      }
    })
  }

  async fetchColumns() {
    let cols = await api.fetchColumns('staff')
    this.props.dispatch({
      type: ActionTypeOfUser.SET_STAFFS_COL_NAME,
      data: {
        columns_name: cols
      }
    })
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