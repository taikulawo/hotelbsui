import { connect } from "react-redux";
import Consumer from './consumer'
import { TypeOfState } from "../../store/reducers";

function mapStateToProps(state: TypeOfState) {
  return {
    consumers: state.user.consumers,
    rooms: state.rooms
  }
}
export default connect(mapStateToProps)(Consumer)