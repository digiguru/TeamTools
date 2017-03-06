import { connect } from "react-redux";
import { selectUser, setUserFocus } from "./ComfortActions";
import {ChaosPickerState, ChaosPickerZoneState} from "./ComfortReactModelState";
import {ReduxUserList} from "./ReactUserComponent";
import { fromJS } from "../3rdParty/immutable.min";
export interface IUser {
  Username: String;
}

export interface IUserUI extends IUser {
  Y: number;
  Focus: String;
}


export interface IUserList { Users: Array<IUser|IUserUI>; }

const mapStateToProps = (state: ChaosPickerState, ownProps: IUserList): IUserList => {
    return {
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