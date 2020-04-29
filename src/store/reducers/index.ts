import { combineReducers, Action, Reducer, AnyAction } from "redux";
const initialState = { count: 0, loading: true }

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
  index
})
