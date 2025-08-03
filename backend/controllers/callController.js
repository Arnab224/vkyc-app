import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';
dotenv.config();

export const getToken = async (req, res) => {
  const { roomName, identity } = req.query;

  if (!roomName || !identity) {
    return res.status(400).json({ message: 'Room name and identity are required' });
  }

  try {
    const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
      identity,
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
    });

    const jwt = await token.toJwt();  

    console.log("Generated JWT:", jwt);
    return res.json({ success: true, token: jwt });

  } catch (err) {
    console.error('Token generation error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};