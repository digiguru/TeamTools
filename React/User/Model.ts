export interface IUser {
  Username: string;
}

export interface IUserUI extends IUser {
  Y    : number;
  Focus: string;
}
export interface IUserUIEvents {
  onUserMouseDown;
  onUserMouseUp;
  onUserOverFocus;
  onUserOffFocus;
}

export interface IUserUIWithEvents extends IUserUI {
    events: IUserUIEvents;
}

export interface IUserList {
  ShowUsers?: boolean;
  Users?    : Array<IUser|IUserUI>;
}
export interface IUserListWithEvents extends IUserList {
  events: IUserUIEvents;
}

export interface IUserable {
  User: string;
}
