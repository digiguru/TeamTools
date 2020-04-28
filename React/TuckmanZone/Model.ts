
export interface ITuckmanZone {
    focus      : string;
    visibility : "appearing" | "hiding";
    index      : number;
    label      : "forming" | "storming" | "norming" | "performing";
    maxWidth?  : number;
    username?  : string;
    Events?    : ITuckmanZoneEvents;
}
export interface ITuckmanZoneEvents {
  onZoneMouseDown: (zone: "forming" | "storming" | "norming" | "performing") => void;
  onZoneMouseUp  : (username: string, zone: "forming" | "storming" | "norming" | "performing", maxDistance: number, event: any) => void;
  onZoneOverFocus: (zone: "forming" | "storming" | "norming" | "performing") => void;
  onZoneOffFocus : (zone: "forming" | "storming" | "norming" | "performing") => void;
}

export interface ITuckmanZoneEventList {
    Events?: ITuckmanZoneEvents;
}
