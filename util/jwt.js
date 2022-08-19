import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signToken = async (payload, options = {}) => {
  const { expiresIn = "1d", algorithm = "HS256" } = options;
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(
      payload,
      process.env.jwtSecret,
      {
        algorithm,
        expiresIn,
      },
      (err, token) => {
        if (err) return reject(err);
        return resolve(token);
      }
    );
  });
};

const verifyToken = async (token) => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, process.env.jwtSecret, (err, decoded) => {
      if (err) return reject(err);
      return resolve(decoded);
    });
  });
};

const refreshToken = async (token) => {
  try {
    const payload = await verifyToken(token);

    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    // We ensure that a new token is not issued until enough time has elapsed
    // In this case, a new token will only be issued if the old token is within
    // 30 seconds of expiry. Otherwise, return a bad request status
    if (payload.exp - nowUnixSeconds > 60) {
      return res.status(400).end();
    }
    const newToken = await signToken(payload, {
      algorithm: "RS256",
      expiresIn: "1d",
    });
    return newToken;
  } catch (err) {
    console.log("error: ", err);
    throw new Error("Error in refreshing token");
  }
};

export default {
  signToken,
  verifyToken,
  refreshToken,
};
