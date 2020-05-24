import { Dispatch } from 'redux';
import { Staffs, UserDispatchAction } from '../../store/reducers/user';
export type PropsType = {
  dispatch: Dispatch<UserDispatchAction>;
  staffs: Staffs;
};
