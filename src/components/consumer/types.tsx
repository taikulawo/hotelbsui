import { Dispatch } from 'redux';
import { Consumers, UserDispatchAction } from '../../store/reducers/user';
import { Rooms } from '../../store/reducers/room';
export type PropsType = {
  dispatch: Dispatch<UserDispatchAction>;
  consumers: Consumers;
  rooms: Rooms
};
