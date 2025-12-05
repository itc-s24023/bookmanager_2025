import { Router } from "express";

import { middlewareCheckUserPermission } from "../../bookManagerCore/app/userPermission.middleware.js";
import authorRoute from "./adminAuthor.route.js";
import bookRoute from "./adminBook.route.js";
import publisherRoute from "./adminPublisher.route.js";

const router = Router();

router.use(middlewareCheckUserPermission("admin"));

router.use("/author", authorRoute);
router.use("/book", bookRoute);
router.use("/publisher", publisherRoute);

export default router;
