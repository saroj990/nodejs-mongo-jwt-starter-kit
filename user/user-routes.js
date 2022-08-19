import express from "express";
import User from "./user-controller";
const router = express.Router();

router.route("/user/:id").get(User.getUser).delete(User.deleteUser);

export default router;
