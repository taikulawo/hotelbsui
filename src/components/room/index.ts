import { connect } from 'react-redux'
import { TypeOfState } from '../../store/reducers'
import Room from "./room";

function mapStateToProps(state: TypeOfState) {
  return {
    rooms: state.rooms
  }
} 
export default connect(mapStateToProps)(Room)