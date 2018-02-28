import { connect } from "react-redux";
import { ITuckmanModel } from "../Tuckman/Model";
import { ITuckmanZone, ITuckmanZoneEventList } from "./Model";
import { TuckmanZone } from "./Component";
import { setZoneFocus, chooseZone } from "../Tuckman/Actions";
import { Point } from "../Models/Point";

const mapStateToProps = (state: ITuckmanModel, props: {label}): ITuckmanZone => {
    const myState: ITuckmanZone = state.zones[props.label];
    myState.maxWidth = state.Size.width;
    myState.username = state.CurrentUser ? state.CurrentUser.Username : "";
    return myState;
};

const mapDispatchToProps = (dispatch): ITuckmanZoneEventList => {
  return {
    Events: {
      onZoneMouseDown: (zone: "forming" | "storming" | "norming" | "performing"): void => {
        dispatch(setZoneFocus(zone, "active"));
      },
      onZoneMouseUp: (user: string, zone: "forming" | "storming" | "norming" | "performing", maxDistance: number, event: any): void => {
        dispatch(setZoneFocus(zone, "not-in-focus"));
        const distance = event.clientX;
        const distanceAsPercentage = Point.distanceAsPercentage(distance, maxDistance);

        dispatch(chooseZone(user, zone, distanceAsPercentage)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
      },
      onZoneOverFocus: (zone: "forming" | "storming" | "norming" | "performing"): void => {
        dispatch(setZoneFocus(zone, "in-focus"));
      },
      onZoneOffFocus: (zone: "forming" | "storming" | "norming" | "performing"): void => {
        dispatch(setZoneFocus(zone, "not-in-focus"));
      }
    }
  };
};
export const TuckmanZoneConnector = connect(
    mapStateToProps,
    mapDispatchToProps
)(TuckmanZone);
