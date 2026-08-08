import { connect } from "react-redux";
import { selectUser, setUserFocus } from "../Comfort/Actions";
import { ComfortAppState } from "../Comfort/Model";
import { ReduxUserList } from "./Component";
import { IUserList, IUserUI } from "./Model";

const mapStateToProps = (state: ComfortAppState, ownProps: IUserList): IUserList => {
    return {
        ShowUsers: state.UserList.ShowUsers,
        Users: (state.UserList.Users ?? []).map((user, index) => ({
            ...user,
            Y: (index * 90) + 60
        } as IUserUI))
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
                dispatch(selectUser(user));
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
