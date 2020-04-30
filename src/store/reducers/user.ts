import { AnyAction, Action, Dispatch } from "redux";
import { useDispatch } from "react-redux";

export interface Any {
  [key: string]: any
}

export interface ConsumerRow extends Any {
  username: string
  password: string
  email: string
  sex: string
  phone: string
  roooid: number
}

export interface StaffRow extends Any {
  username: string
  role: string
  phone: string
}

export type Consumers = {
  columns: Array<string>,
  rows: Array<ConsumerRow>
}

export type Staffs = {
  columns: Array<string>,
  rows: Array<StaffRow>
}

export interface StateOfInitial {
  consumers: Consumers
  staffs: Staffs
}

const initialState: StateOfInitial = {
  consumers: {
    columns: [],
    rows: []
  },
  staffs: {
    columns: [],
    rows: []
  }
}

export enum ActionTypeOfUser {
  'SET_CONSUMERS_ROWS',
  'SET_CONSUMERS_COLUMNS',
  'SET_STAFFS_ROWS',
  'SET_STAFFS_COLUMNS'
}

export interface UserDispatchAction extends Action {
  data: Consumers | Staffs
}

export default function (state = initialState, action: UserDispatchAction): StateOfInitial {
  // const dispatch = useDispatch<Dispatch<UserDispatchAction>>()
  switch (action.type) {
    case ActionTypeOfUser.SET_CONSUMERS_ROWS: {
      return {
        ...state,
        consumers: {
          ...state.consumers,
          rows: action.data.rows as Array<ConsumerRow>
        }
      }
    }
    case ActionTypeOfUser.SET_CONSUMERS_COLUMNS: {
      return {
        ...state,
        consumers: {
          ...state.consumers,
          columns: action.data.columns
        }
      }
    }
    case ActionTypeOfUser.SET_STAFFS_ROWS: {
      return {
        ...state,
        staffs:{
          ...state.consumers,
          rows: action.data.rows as Array<StaffRow>
        }
      }
    }
    case ActionTypeOfUser.SET_STAFFS_COLUMNS: {
      return {
        ...state,
        staffs:{
          ...state.consumers,
          rows: action.data.rows as Array<StaffRow>
        }
      }
    }
    default: {
      return state
    }
  }
}