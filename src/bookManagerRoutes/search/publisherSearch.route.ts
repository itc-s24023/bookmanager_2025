import { Router } from "express";
import { validateIsString } from "../../bookManagerCore/requestValidator.js";
import { validationResult } from "express-validator";
import { db_getPublishersByNameKeyword } from "../../bookManagerCore/db/publisherRepository.js";

const router = Router();

router.get(
  "/",
  validateIsString("keyword"),

  async (req, res) => {
    const val = validationResult(req);
    if (!val.isEmpty())
      return res.status(400).json({
        message: val
          .array()
          .map((v) => v.msg)
          .join(", "),
      });

    const { keyword } = req.body;

    const db_data = await db_getPublishersByNameKeyword(keyword);

    if (!db_data.ok)
      return res.status(400).json({ message: "出版社の検索に失敗しました" });

    const publishers = db_data.data;
    return res.status(200).json({ publishers });
  }
);

export default router;
