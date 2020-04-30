import { Button, Form, Input, InputNumber, Modal, Select, Space, Spin, Table } from 'antd'
import { TableRowSelection } from 'antd/lib/table/interface'
import React from 'react'
import api from '../../api'
import { ActionTypeOfUser, Consumers, ID } from '../../store/reducers/user'
import { convertToColumn, convertToDataSource } from '../../util'
import { PropsType } from './types'
const { Option } = Select
type StateType = {
  dataSource: Array<{ [key: string]: string }>
  columns?: any[]
  selectedRowKeys: ID[]
  loading: boolean,
  modalVisiable: boolean,
  confirmLoading: false
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
      confirmLoading: false
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
      await api.deleteSingle('consumer', id)
    })
    await Promise.all(promises)
    await this.fetchConsumers()
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
            <Modal visible={this.state.modalVisiable} title="添加旅客" onOk={this.handleModalOk} onCancel={this.handleModalCancel} confirmLoading={this.state.confirmLoading}>
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
                  rules={[{ required: true, message: "请选择房间类型"}]}
                >
                  <Select>
                    {
                      
                    }
                  </Select>
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
    await this.fetchConsumers()
    const dsource = convertToDataSource(this.props.consumers.columns,'id')
    const cols = convertToColumn(this.props.consumers.columns_name)
    this.setState(({
      ...this.state,
      columns: cols,
      dataSource: dsource
    }))
  }


  async componentDidUpdate() {
    // await this.fetchConsumers()
  }

  async fetchConsumers() {
    let { code, data } = await api.queryAll('consumer')
    this.props.dispatch({
      type: ActionTypeOfUser.SET_CONSUMERS_COLUMNS,
      data: {
        columns: data as Consumers
      }
    })
  }

  async fetchColumns() {
    let cols = await api.fetchColumns('consumer')
    this.props.dispatch({
      type: ActionTypeOfUser.SET_CONSUMERS_COL_NAME,
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