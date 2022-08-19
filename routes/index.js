import express from "express";
import { isLoggedIn } from "../middlewares/auth";
import userRoutes from "../user/user-routes";

const router = express.Router();
const routes = [userRoutes];

router.use("/", isLoggedIn, ...routes);
export default router;
