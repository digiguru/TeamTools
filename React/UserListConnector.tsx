import { connect } from "react-redux";
import { selectUser } from "ComfortActions";
import {ChaosPickerState, ChaosPickerZoneState} from "ComfortReactModelState";
import {ReduxUserList} from "ReactUserComponent";

export interface IUser {
    username: String;
    y: number;
}
export interface IUserList { users: Array<IUser>; }

export class UserObject implements IUser {
    username: String;
    y: number;
    focal: String;
    constructor(name: String, index: number) {
        this.username = name;
        this.y = (index * 90) + 60;
        this.focal = "no-focus";
    }
}

const mapStateToProps = (state: ChaosPickerState, ownProps: IUserList) => {
    return state.UserList.map((u, i) => {
        return new UserObject(u, i);
    });
};


const mapDispatchToProps = (dispatch) => {
  return {
    events: {
      onZoneMouseDown: (zone) => {
        dispatch(setActiveFocus(zone));
      },
      onZoneMouseUp: (user: string, zone: "Comfort" | "Chaos" | "Stretch", event: any) => {
        dispatch(setOffFocus(zone));
        const coord = [event.clientX, event.clientY];
        const centerPoint = getCenterPointFromElement(event.currentTarget);
        const distance = Point.distance(centerPoint, Point.fromCoords(coord));
        dispatch(chooseZone(user, zone, distance)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
      },
      onZoneOverFocus: (zone) => {
        dispatch(setOverFocus(zone));
      },
      onZoneOffFocus: (zone) => {
        dispatch(setOffFocus(zone));
      }
    }
  };
};

export const ReduxChaosConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxUserList);

// UserListConnector