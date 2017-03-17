import { connect } from "react-redux";
import { selectUser, setUserFocus } from "../Comfort/Actions";
import {ComfortAppState} from "../Comfort/Model";
import {ReduxUserList} from "./Component";
import { fromJS } from "immutable";
export interface IUser {
  Username: string;
}

export interface IUserUI extends IUser {
  Y: number;
  Focus: string;
}

export interface IUserUIWithEvents extends IUserUI {
  onUserMouseDown;
  onUserMouseUp;
  onUserOverFocus;
  onUserOffFocus;
}


export interface IUserList {
  ShowUsers: boolean;
  Users: Array<IUser|IUserUI>;
}

const mapStateToProps = (state: ComfortAppState, ownProps: IUserList): IUserList => {
    return {
      ShowUsers: state.UserList.ShowUsers,
      Users: state.UserList.Users.map((u, i) => {
        return fromJS(u).set("Y", (i * 90) + 60).toJS();
      })
    };
};


const mapDispatchToProps = (dispatch) => {
  return {
    events: {
      onUserMouseDown: (user: string) => {
        dispatch(setUserFocus(user, "active"));
      },
      onUserMouseUp: (user: string, event: any) => {
        dispatch(setUserFocus(user, "not-in-focus"));
        /*const coord = [event.clientX, event.clientY];
        const centerPoint = getCenterPointFromElement(event.currentTarget);
        const distance = Point.distance(centerPoint, Point.fromCoords(coord));*/

        dispatch(selectUser(user)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
      },
      onUserOverFocus: (user: string) => {
        dispatch(setUserFocus(user, "in-focus"));
      },
      onUserOffFocus: (user: string) => {
        dispatch(setUserFocus(user, "not-in-focus"));
      }
    }
  };
};

export const ReduxUserConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserList);

// UserListConnector