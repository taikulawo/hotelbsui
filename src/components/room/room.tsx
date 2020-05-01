import React from 'react'
import { Dispatch } from 'redux'
import api from '../../api'
import { ID } from '../../store/reducers/user'
import { Table, Select, Button, Spin, Space, Modal, Form, Input, InputNumber } from 'antd'
import { convertToDataSource, convertToColumn } from '../../util'
import { TableRowSelection } from 'antd/lib/table/interface'
import { Rooms, ActionTypeOfRoom, RoomDispatchAction } from '../../store/reducers/room'
import { FormInstance } from 'antd/lib/form'
const { Option } = Select
type PropsType = {
  dispatch: Dispatch<RoomDispatchAction>
  rooms: Rooms
}

type StateType = {
  dataSource: Array<{ [key: string]: string }>
  columns?: any[]
  selectedRowKeys: ID[]
  loading: boolean,
  modalVisiable: boolean,
  confirmLoading: boolean,
  values: RoomValueType,
  form: React.RefObject<FormInstance>
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
      form: React.createRef<FormInstance>(),
      values: {
        chairs: 1,
        picurl: '',
        roomtype: '',
        roomtypeid: ''
      }
    }
  }
  asyncSet = (state: StateType): Promise<any> => new Promise(resolve => this.setState(state,resolve))
  emptyValue = (): RoomValueType => ({
    chairs: 1,
    picurl: '',
    roomtype: '',
    roomtypeid: ''
  })

  onSelectChange(selectedRowKeys: ID[]) {
    this.setState({ ...this.state, selectedRowKeys });
  }

  deleteRows = async () => {
    await this.asyncSet({
      ...this.state,
      loading: true
    })
    let source = [...this.state.dataSource]
    for (let i = 0; i < source.length; i++) {
      if (this.state.selectedRowKeys.includes(source[i]['roomtypeid'])) {
        source.splice(i, 1)
      }
    }
    const promises = this.state.selectedRowKeys.map(async id => {
      await api.deleteSingle('room', id)
    })
    await Promise.all(promises)
    await this.fetchRooms()
    debugger
    this.setState({
      ...this.state,
      dataSource: source,
      selectedRowKeys: [],
      loading: false
    },() => {
      this.forceUpdate()
    })
  }

  addRow = async () => {
    this.setState({
      ...this.state,
      modalVisiable: true,
      values: this.emptyValue()
    })
  }

  handleModalOk = async () => {
    try {
      await this.state.form.current?.validateFields()
    } catch (e) {
      console.log(e)
      return
    }
    this.setState({
      ...this.state,
      confirmLoading: true
    }, async () => {
      const { data } = await api.insert('room', this.state.values)
      let lastid = (data as any)['lastId']
      this.setState({
        ...this.state,
        confirmLoading: false,
        modalVisiable: false
      }, () => {
        let v = this.state.values
        const originDataSource = this.state.dataSource
        v['roomtypeid'] = lastid
        let converted = convertToDataSource([v], 'roomtypeid')
        let newData = [...converted, ...originDataSource]
        this.setState({
          ...this.state,
          dataSource: newData,
          values: this.emptyValue()
        })
      })
    })
  }
  handleModalCancel = async () => {
    this.setState({
      ...this.state,
      modalVisiable: false,
      confirmLoading: false,
      values: this.emptyValue()
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
            <Modal visible={this.state.modalVisiable} title="添加房间类型" onOk={this.handleModalOk} onCancel={this.handleModalCancel} confirmLoading={this.state.confirmLoading}>
              <Form {...formItemLayout} ref={this.state.form}>
                <Form.Item
                  name="roomtype"
                  label="房间类型"
                  rules={[{ required: true, message: "请输入房间类型" }]}
                >
                  <Input value={this.state.values.roomtype} onChange={e => this.setState({ ...this.state, values: { ...this.state.values, roomtype: e.target.value } })} />
                </Form.Item>
                <Form.Item name="chair" label="椅子" rules={[
                  {
                    required: true,
                    message: "输入房间椅子数量"
                  }
                ]}>
                  <InputNumber min={1} value={this.state.values.chairs} onChange={e => this.setState({ ...this.state, values: { ...this.state.values, chairs: e } })} />
                </Form.Item>
                <Form.Item
                  name="picurl"
                  label="房间图片地址"
                  rules={[{ required: true, message: '房间图片' }]}
                >
                  <Input value={this.state.values.picurl} style={{ width: '100%' }} onChange={e => this.setState({ ...this.state, values: { ...this.state.values, picurl: e.target.value } })} />
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
    await this.fetchRooms()
    const dsource = convertToDataSource(this.props.rooms.columns, 'roomtypeid')
    const cols = convertToColumn(this.props.rooms.columns_name)
    this.setState(({
      ...this.state,
      columns: cols,
      dataSource: dsource
    }))
  }


  async componentDidUpdate() {
  }

  async fetchRooms() {
    let { code, data } = await api.queryAll('room')
    this.props.dispatch({
      type: ActionTypeOfRoom.SET_ROOMS_COLUMNS,
      data: {
        columns: data
      }
    })
  }

  async fetchColumns() {
    let cols = await api.fetchColumns('room')
    this.props.dispatch({
      type: ActionTypeOfRoom.SET_ROOMS_COLUMNS_NAME,
      data: {
        columns_name: cols
      }
    })
  }
}

export type RoomModalProps = {
  visiable: boolean
  handleOk: () => {}
  handleCancel: () => {}
  confirmLoading: boolean,
  values: RoomValueType
}

export type RoomValueType = {
  roomtypeid: string
  chairs?: number
  roomtype: string
  picurl: string
}
function popup(props: RoomModalProps) {
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  )
  return (
    <Modal visible={props.visiable} title="添加房间类型" onOk={props.handleOk} onCancel={props.handleCancel} confirmLoading={props.confirmLoading}>
      <Form {...formItemLayout}>
        <Form.Item
          name="roomtype"
          label="房间类型"
          rules={[{ required: true, message: "请输入房间类型" }]}
        >
          <Input value={props.values.roomtype} onChange={e => { props.values.roomtype = e.target.value }} />
        </Form.Item>
        <Form.Item name="chair" label="椅子" rules={[
          {
            required: true,
            message: "输入房间椅子数量"
          }
        ]}>
          <InputNumber min={1} value={props.values.chairs} />
        </Form.Item>
        <Form.Item
          name="picurl"
          label="房间图片地址"
          rules={[{ required: true, message: '房间图片' }]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
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