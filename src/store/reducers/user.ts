import { AnyAction, Action, Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { RoomColumn } from "./room";

export interface Any {
  [key: string]: any
}

export interface ConsumerColumn extends Any {
  username: string
  roomtypeid: string
  email: string
  sex: string
  phone: string
  id: string
}

export type User = Consumers | Staffs
export type Columns = ConsumerColumn | StaffColumn | RoomColumn
export type ID = string
export interface StaffColumn extends Any {
  username: string
  email: string
  sex: string
  phone: string
  id: ID
  role: string
}

export type Consumers = {
  columns_name: Array<string>,
  columns: Array<ConsumerColumn>
}

export type Staffs = {
  columns_name: Array<string>,
  columns: Array<StaffColumn>
}

export interface StateOfInitial {
  consumers: Consumers
  staffs: Staffs
}

const initialState: StateOfInitial = {
  consumers: {
    columns_name: [],
    columns: []
  },
  staffs: {
    columns_name: [],
    columns: []
  }
}

export enum ActionTypeOfUser {
  'SET_CONSUMERS_COLUMNS',
  'SET_CONSUMERS_COL_NAME',
  'SET_STAFFS_COLUMNS',
  'SET_STAFFS_COL_NAME'
}

export interface UserDispatchAction extends Action {
  data: any
  type: ActionTypeOfUser
}

export default function (state = initialState, action: UserDispatchAction): StateOfInitial {
  // const dispatch = useDispatch<Dispatch<UserDispatchAction>>()
  switch (action.type) {
    case ActionTypeOfUser.SET_CONSUMERS_COLUMNS: {
      return {
        ...state,
        consumers: {
          ...state.consumers,
          columns: action.data.columns as Array<ConsumerColumn>
        }
      }
    }
    case ActionTypeOfUser.SET_CONSUMERS_COL_NAME: {
      return {
        ...state,
        consumers: {
          ...state.consumers,
          columns_name: action.data.columns_name
        }
      }
    }
   
    case ActionTypeOfUser.SET_STAFFS_COLUMNS: {
      return {
        ...state,
        staffs: {
          ...state.staffs,
          columns: action.data.columns as Array<StaffColumn>
        }
      }
    }
    case ActionTypeOfUser.SET_STAFFS_COL_NAME: {
      return {
        ...state,
        staffs: {
          ...state.staffs,
          columns_name: action.data.columns_name
        }
      }
    }
    default: {
      return state
    }
  }
}