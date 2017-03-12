import { connect } from "react-redux";
import { setZoneFocus, chooseZone } from "./ComfortActions";
import {ChaosPickerState, ChaosPickerZoneState} from "./ComfortReactModelState";
import {ReduxChaosArea, ReduxStretchArea, ReduxComfortArea} from "./ComfortReduxZone";
import {Point} from "./Point";
/*import {SVG} from "../Shared/SVG";*/

const mapStateToProps = (state: ChaosPickerState, ownProps: ChaosPickerZoneState) => {
    if (ownProps.Name === "Comfort") {
      return {zone: state.Zones.Comfort, user: state.CurrentUser};
    } else if (ownProps.Name === "Chaos") {
      return {zone: state.Zones.Chaos, user: state.CurrentUser};
    } else {
      return {zone: state.Zones.Stretch, user: state.CurrentUser};
    }
};

const getCenterPointFromElement = (el) => {
  const boundingBox = el.getBBox();
  const centerX = (boundingBox.width - boundingBox.x) / 2;
  const centerY = (boundingBox.height - boundingBox.y) / 2;
  return new Point(centerX, centerY);
};

const mapDispatchToProps = (dispatch) => {
  return {
    events: {
      onZoneMouseDown: (zone) => {
        dispatch(setZoneFocus(zone, "active"));
      },
      onZoneMouseUp: (user: string, zone: "Comfort" | "Chaos" | "Stretch", event: any) => {
        dispatch(setZoneFocus(zone, "not-in-focus"));
        const coord = [event.clientX, event.clientY];
        const centerPoint = getCenterPointFromElement(event.currentTarget);
        const distance = Point.distance(centerPoint, Point.fromCoords(coord));
        dispatch(chooseZone(user, zone, distance)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
      },
      onZoneOverFocus: (zone) => {
        dispatch(setZoneFocus(zone, "in-focus"));
      },
      onZoneOffFocus: (zone) => {
        dispatch(setZoneFocus(zone, "not-in-focus"));
      }
    }
  };
};

export const ReduxChaosConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxChaosArea);

export const ReduxStretchConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxStretchArea);

export const ReduxComfortConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxComfortArea);



