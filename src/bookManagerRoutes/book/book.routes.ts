import { Router } from "express";

import bookListRoute from "./list/bookList.route.js";
import bookDetailRoute from "./detail/bookDetail.route.js";

import { middlewareCheckUserPermission } from "../../bookManagerCore/app/userPermission.middleware.js";

import rentalRoute from "./bookRental.route.js";
import returnRoute from "./bookReturn.route.js";

const router = Router();

router.use("/list", bookListRoute);
router.use("/detail", bookDetailRoute);

router.use(middlewareCheckUserPermission("user"));

router.use("/rental", rentalRoute);
router.use("/return", returnRoute);

export default router;
