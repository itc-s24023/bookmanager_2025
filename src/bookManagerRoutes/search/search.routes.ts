import { Router } from "express";

import authorRoute from "./authorSearch.route.js";
import publisherRoute from "./publisherSearch.route.js";

const router = Router();

router.use("/author", authorRoute);
router.use("/publisher", publisherRoute);

export default router;
