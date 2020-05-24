import { connect } from "react-redux";
import Staff from './staff'
import { TypeOfState } from "../../store/reducers";

function mapStateToProps(state: TypeOfState) {
  return {
    staffs: state.user.staffs
  }
}
export default connect(mapStateToProps)(Staff)