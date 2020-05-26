import { connect } from 'react-redux'
import { TypeOfState } from '../../store/reducers'
import Room from "./room";
import { Dispatch } from 'redux';

function mapStateToProps(state: TypeOfState) {
  return {
    rooms: state.rooms
  }
}

// function mapDispatchToProps(dispatch: Dispatch) {

// }

export default connect(mapStateToProps)(Room)