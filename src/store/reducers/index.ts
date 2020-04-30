import { combineReducers, Action, Reducer, AnyAction } from "redux";
import user, { StateOfInitial } from './user'
const initialState: indexTypeOfState = { count: 0, loading: true }
export type indexTypeOfState = {
  count: number
  loading: boolean
}
function index(state = initialState, action: AnyAction) {
  switch (action.type) {
    case 'PLUS_COUNT':
      return { ...state, count: ++state.count }
    case 'SET_LOADING':
      return { ...state, loading: !!action.loading }
    default:
      return state
  }
}


export default combineReducers({
  index,
  user
})

export type TypeOfState = {
  user: StateOfInitial,
  index: indexTypeOfState
}
