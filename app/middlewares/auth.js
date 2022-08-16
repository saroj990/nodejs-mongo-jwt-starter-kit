import jwt from "../util/jwt";
import { isEmpty } from "lodash";
import { Error } from "../constants";
export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verifyToken(token);

    if (isEmpty(user)) {
      return next(Error.TOKEN_INVALID);
    } else {
      req.user = user;
      req.isLoggedIn = true;
      next();
    }
  } catch {
    return res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
