import { Router } from "express";

import registerRoute from "./userRegister.route.js";
import loginRoute from "./userLogin.route.js";
import historyRoute from "./userHistory.route.js";
import changeRoute from "./userUpdate.route.js";
import { middlewareCheckUserPermission } from "../../bookManagerCore/app/userPermission.middleware.js";

const router = Router();

router.use("/register", registerRoute);
router.use("/login", loginRoute);

router.use(middlewareCheckUserPermission("user"));

router.use("/history", historyRoute);
router.use("/change", changeRoute);

export default router;
