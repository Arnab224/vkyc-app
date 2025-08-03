import { AccessToken } from "livekit-server-sdk";

export const generateLivekitToken = (identity, roomName) => {
  const token = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity }
  );
  token.addGrant({ roomJoin: true, room: roomName });
  return token.toJwt();
};