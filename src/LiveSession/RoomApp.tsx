import React from "react";
import { LandingPage } from "./LandingPage";
import { RoomPage } from "./RoomPage";
import { roomIdFromLocation } from "./realtime";

export default function RoomApp() {
  const roomId = roomIdFromLocation();
  return roomId ? <RoomPage roomId={roomId} /> : <LandingPage />;
}
