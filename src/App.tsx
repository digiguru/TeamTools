import React from "react";
import { Analytics } from "@vercel/analytics/react";
import "./Shared/styles.css";
import RoomApp from "./LiveSession/RoomApp";

export default function App() {
  return (
    <>
      <RoomApp />
      <Analytics />
    </>
  );
}
