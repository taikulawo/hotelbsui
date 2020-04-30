import { Dispatch } from 'redux';
import { Consumers, UserDispatchAction } from '../../store/reducers/user';
export type PropsType = {
  dispatch: Dispatch<UserDispatchAction>;
  consumers: Consumers;
};
