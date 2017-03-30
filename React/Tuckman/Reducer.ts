
// import {ComfortActions} from "./Actions";
import { ITuckmanModel, ITuckmanZoneList } from "./Model";
import { fromJS, List, Map } from "../3rdParty/immutable.min";
import { DOMMeasurement } from "../Models/IDomMeasurement";
import { Size } from "../Models/Size";
import { Point } from "../Models/Point";
import { TuckmanActions } from "./Actions";
import { IUser } from "../User/Model";


const initialSize: Size = new Size(800, 800);
const initialState: ITuckmanModel = {
    UserList : {
        ShowUsers: true,
        Users: [
            {Username: "Adam Hall", Focus: "not-in-focus", Y: 0 },
            {Username: "Caroline Hall", Focus: "not-in-focus", Y: 0 }
        ]
    },
    Size: initialSize,
    zones: {
        forming   : {index: 0, label: "forming",    focus: "not-in-focus", Events: undefined},
        storming  : {index: 1, label: "storming",   focus: "not-in-focus", Events: undefined},
        norming   : {index: 2, label: "norming",    focus: "not-in-focus", Events: undefined},
        performing: {index: 3, label: "performing", focus: "not-in-focus", Events: undefined}
    },
    UserChoices: []
    /*CenterPoint: new Point(initialSize.width / 2, initialSize.height / 2),

    Zones : {
        Comfort: {Name: "Comfort", Focus: "not-in-focus", Range: {Start: 0, End: 100}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Stretch: {Name: "Stretch", Focus: "not-in-focus", Range: {Start: 100, End: 200}, Size: {Width: new DOMMeasurement("50%"), Height: new DOMMeasurement("50%")}},
        Chaos: {Name: "Chaos", Focus: "not-in-focus", Range: {Start: 200, End: 300}, Size: {Width: new DOMMeasurement("100%"), Height: new DOMMeasurement("100%")}}
    },
    ShowUserChoices: false,
    */

};

export function tuckmanReactApp(state: ITuckmanModel = initialState, action): ITuckmanModel {
    switch (action.type) {
       case TuckmanActions.SET_STAGESIZE:
            return TuckmanZoneAction.setStageSize(state, (<any>action).width, (<any>action).height);
        case TuckmanActions.SET_USERFOCUS:
            return TuckmanZoneAction.setUserFocus(state, (<any>action).user, (<any>action).focus);
        case TuckmanActions.SET_ZONEFOCUS:
            return TuckmanZoneAction.setZoneFocus(state, (<any>action).area, (<any>action).focus);
         case TuckmanActions.SELECT_USER:
            return TuckmanZoneAction.selectUser(state, (<any>action).user);
        case TuckmanActions.CHOOSE_ZONE:
            return TuckmanZoneAction.chooseZone(state, (<any>action).user, (<any>action).area, (<any>action).distance);
        case TuckmanActions.TOGGLE_CHOICES:
            return TuckmanZoneAction.toggleChoiceVisibility(state, (<any>action).visible);
        default:
            return state;
    }
}
class TuckmanZoneAction {

    static setStageSize(state: ITuckmanModel, width: number, height: number): ITuckmanModel {
        const newCenter = new Point(width / 2, height / 2);
        return fromJS(state)
            .set("Size", new Size(width, height))
            .set("CenterPoint", newCenter)
            .toJS();
    }
    static setZoneFocus(state: ITuckmanModel, area: "forming" | "storming" | "norming" | "performing", focus: "in-focus" | "active" | "not-in-focus"): ITuckmanModel {
        return fromJS(state)
            .setIn(["zones", "forming", "focus"], area === "forming" ? focus : "not-in-focus")
            .setIn(["zones", "storming", "focus"], area === "storming"  ? focus : "not-in-focus")
            .setIn(["zones", "norming", "focus"], area === "norming"  ? focus : "not-in-focus")
            .setIn(["zones", "performing", "focus"], area === "performing"  ? focus : "not-in-focus").toJS();
    }
    static setUserFocus(state: ITuckmanModel, user: string, focus: "in-focus" | "active" | "not-in-focus"): ITuckmanModel {
        const originalList = List(state.UserList.Users);
        const newUserList = originalList.update(
            originalList.findIndex(item => item.Username === user),
            (item) => fromJS(item).set("Focus", focus)).toJS();
        return fromJS(state)
            .setIn(["UserList", "Users"], newUserList).toJS();
    }
    static selectUser(state: ITuckmanModel, user: String): ITuckmanModel {
        const originalList = List(state.UserList.Users);
        const item: IUser = originalList.find(item => item.Username === user);
        // Sets currentUser, and therefor hides the user choice menu
        const data = fromJS(state)
            .set("CurrentUser", item)
            .set("ShowUserChoices", false)
            .setIn(["UserList", "ShowUsers"], false);

        return data.toJS();
    }

    static chooseZone(
        state: ITuckmanModel, user: string, area: "forming" | "storming" | "norming" | "performing",
        distance: number): ITuckmanModel {

        // Add the user choice
        const newUserChoices = List(state.UserChoices).push({
            User: {Username: user},
            Zone: area,
            Distance: distance
        }).toJS();
        // Remove the user from the choice list
        const newUserList = List(state.UserList.Users).filter((item) => item.Username !== user).toArray();
        // Show the user list
        const showUserChoice = !!(newUserList.length);
        // Return
        return fromJS(state)
            .delete("CurrentUser")
            .set("ShowUserChoices", showUserChoice)
            .set("UserChoices", newUserChoices)
            .setIn(["UserList", "Users"], newUserList)
            .setIn(["UserList", "ShowUsers"], showUserChoice).toJS();
    }
    static toggleChoiceVisibility(state: ITuckmanModel, visible: boolean): ITuckmanModel {
        // Set "showUserChoices" to true
        return Map(state)
            .set("ShowUserChoices", visible).toJS();
    };
}
