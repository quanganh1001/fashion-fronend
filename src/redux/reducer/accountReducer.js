import {FETCH_USER_LOGIN_SUCCESS} from '../action/accountAction'

const INITIAL_STATE = {
  account: {
    access_token: "",
    refresh_token: "",
    username: "",
    role: "",
  },
  isAuthenticated: false,
};
const accountReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    
    case FETCH_USER_LOGIN_SUCCESS:
        console.log(action);
      return {
        ...state,
        account: {
          access_token: action?.payload?.token,
          refresh_token: action?.payload?.refreshToken,
          username: action?.payload?.username,
          role: action?.payload?.role,
        },
        isAuthenticated: true,
      };
    default: return state;
  }
};

export default accountReducer;
