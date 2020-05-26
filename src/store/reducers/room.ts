import { Action } from "redux"

export type StateOfInitial = Rooms

const initialState: StateOfInitial = {
  columns: [],
  columns_name: [],
  curr: {
    chairs: 1,
    picurl: '',
    roomtype: '',
    roomtypeid: ''
  }
}

export type Rooms = {
  columns_name: Array<string>
  columns: Array<RoomColumn>
  curr: RoomColumn
}

export interface RoomDispatchAction extends Action {
  data: any
}

export interface RoomColumn {
  roomtypeid: string
  chairs?: number
  roomtype: string,
  picurl: string
}

export enum ActionTypeOfRoom {
  'SET_ROOMS_COLUMNS',
  'SET_ROOMS_COLUMNS_NAME',
  'FETCH_ALL_COLUMNS'
}

export default function (state = initialState, action: RoomDispatchAction): StateOfInitial {
  switch (action.type) {
    case ActionTypeOfRoom.SET_ROOMS_COLUMNS: {
      return {
        ...state,
        columns: action.data.columns
      }
    }
    case ActionTypeOfRoom.SET_ROOMS_COLUMNS_NAME: {
      return {
        ...state,
        columns_name: action.data.columns_name
      }
    }
    default:{
      return state
    }
  }
}