import { RoomPage } from "../../../src/LiveSession/RoomPage";

export const dynamic = "force-dynamic";

export default async function LiveRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  return <RoomPage roomId={roomId.toLowerCase()} />;
}
