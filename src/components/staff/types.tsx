import { Dispatch } from 'redux';
import { Staffs, UserDispatchAction } from '../../store/reducers/user';
import { Rooms } from '../../store/reducers/room';
export type PropsType = {
  dispatch: Dispatch<UserDispatchAction>;
  staffs: Staffs;
  rooms: Rooms
};
