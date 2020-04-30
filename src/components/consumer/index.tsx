import { connect } from "react-redux";
import { } from "redux";
import Consumer from './consumer'
import { TypeOfState } from "../../store/reducers";

function mapStateToProps(state:TypeOfState) {
  return {
    consumers: state.user.consumers
  }
}
export default connect(mapStateToProps)(Consumer)