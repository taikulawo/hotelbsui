import { connect } from "react-redux";
import Staff from './staff'
import { TypeOfState } from "../../store/reducers";

function mapStateToProps(state: TypeOfState) {
  return {
    staffs: state.user.staffs,
    rooms: state.rooms
  }
}
export default connect(mapStateToProps)(Staff)