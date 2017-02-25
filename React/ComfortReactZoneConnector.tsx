import { connect } from "react-redux";
import { setOverFocus, setOffFocus, setActiveFocus, chooseZone } from "ComfortActions";
import {ChaosPickerState, ChaosPickerZoneState} from "ComfortReactModelState";
import {ReduxChaosArea, ReduxStretchArea, ReduxComfortArea} from "ComfortReduxZone";
import {Point} from "Point";
/*import {SVG} from "../Shared/SVG";*/

const mapStateToProps = (state: ChaosPickerState, ownProps: ChaosPickerZoneState) => {
    
    if (ownProps.Name === "Comfort") {
      return {zone: state.Zones.Comfort, user: "Adam Hall"};
    } else if (ownProps.Name === "Chaos") {
      return {zone: state.Zones.Chaos, user: "Adam Hall"};
    } else {
      return {zone: state.Zones.Stretch, user: "Adam Hall"};
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
)(ReduxChaosArea);

export const ReduxStretchConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxStretchArea);

export const ReduxComfortConnector = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReduxComfortArea);



