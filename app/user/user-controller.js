import User from "./user-model";
import { isEmpty } from "lodash";
import { Error } from "../constants";
import bcrypt from "bcryptjs";
import jwt from "../util/jwt";

const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      throw new Error(Error.INVALID_INPUTS);
    }

    const user = await User.find({ email });

    if (!isEmpty(user)) {
      return res.status(409).send(Error.USER_EXISTS);
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const created = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    return res.status(200).json(created);
  } catch (err) {
    console.log("Error caught: ", err);
    return res.status(500).send(err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error(Error.INVALID_INPUTS);
    }

    const user = await User.findOne({ email }).exec();

    if (
      isEmpty(user) ||
      (user.password && !bcrypt.compareSync(password, user.password))
    ) {
      return res.status(500).send(Error.INVALID_CREDENTIALS);
    }

    const token = await jwt.signToken({
      email: user.email,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    res.cookie("token", token, { maxAge: 24 * 60 * 60 });
    res.send(token).end();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};

const getUser = async (req, res) => {
  const id = req?.params?.id || req?.body?.id;
  try {
    if (!id) {
      throw new Error(Error.INVALID_INPUTS);
    }
    const user = await User.findById(id);
    return res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
};
const deleteUser = async (req, res) => {};

export default {
  register,
  login,
  getUser,
  deleteUser,
};
