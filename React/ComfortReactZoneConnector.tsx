import { connect } from "react-redux";
import { setZoneFocus, chooseZone } from "./Models/ComfortActions";
import {ChaosPickerState, ChaosPickerZoneState, IChaosPickerZoneConnector, IChaosPickerZoneEventObject} from "./ComfortReactModelState";
import {ReduxChaosArea, ReduxStretchArea, ReduxComfortArea} from "./ComfortReduxZone";
import {Point} from "./Point";
/*import {SVG} from "../Shared/SVG";*/

const mapStateToProps = (state: ChaosPickerState, ownProps: ChaosPickerZoneState) : IChaosPickerZoneConnector => {
    if (ownProps.Name === "Comfort") {
      return {Zone: state.Zones.Comfort, User: state.CurrentUser, CenterPoint: state.CenterPoint};
    } else if (ownProps.Name === "Chaos") {
      return {Zone: state.Zones.Chaos, User: state.CurrentUser, CenterPoint: state.CenterPoint};
    } else {
      return {Zone: state.Zones.Stretch, User: state.CurrentUser, CenterPoint: state.CenterPoint};
    }
};

const getCenterPointFromElement = (el) => {
  const boundingBox = el.getBBox();
  const centerX = (boundingBox.width - boundingBox.x) / 2;
  const centerY = (boundingBox.height - boundingBox.y) / 2;
  return new Point(centerX, centerY);
};


const mapDispatchToProps = (dispatch) : IChaosPickerZoneEventObject => {
  return {
    Events: {
      onZoneMouseDown: (zone: "Comfort" | "Chaos" | "Stretch"): void => {
        dispatch(setZoneFocus(zone, "active"));
      },
      onZoneMouseUp: (user: string, zone: "Comfort" | "Chaos" | "Stretch", centerPoint: Point, event: any): void => {
        dispatch(setZoneFocus(zone, "not-in-focus"));
        const coord = [event.clientX, event.clientY];
        // const centerPoint = getCenterPointFromElement(event.currentTarget);
        const distance = Point.distance(centerPoint, Point.fromCoords(coord));
        dispatch(chooseZone(user, zone, distance, centerPoint.x, centerPoint.y)); // user: string, area: "Chaos" | "Stretch" | "Comfort", distance: number
      },
      onZoneOverFocus: (zone: "Comfort" | "Chaos" | "Stretch"): void => {
        dispatch(setZoneFocus(zone, "in-focus"));
      },
      onZoneOffFocus: (zone: "Comfort" | "Chaos" | "Stretch"): void => {
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



