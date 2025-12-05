import { Router } from "express";
import { validationResult } from "express-validator";
import { db_addBook, dbDeleteBook, db_updateBook } from "../../bookManagerCore/db/bookRepository.js";
import {
  validateIsInt,
  validateIsISBN,
  validateIsString,
  validateIsUUID,
} from "../../bookManagerCore/requestValidator.js";

const router = Router();

const valCalls = [
  validateIsISBN("isbn"),

  validateIsString("title"),

  validateIsUUID("author_id"),

  validateIsUUID("publisher_id"),

  validateIsInt("publication_year"),

  validateIsInt("publication_month", { min: 1, max: 12 }),
];

router
  .post("/", ...valCalls, async (req, res) => {
    const val = validationResult(req);
    if (!val.isEmpty())
      return res.status(400).json({
        message: val
          .array()
          .map((v) => v.msg)
          .join(", "),
      });

    const {
      isbn,
      title,
      author_id,
      publisher_id,
      publication_year,
      publication_month,
    } = req.body;

    const db_data = await db_addBook(
      Number(isbn),
      title,
      author_id,
      publisher_id,
      Number(publication_year),
      Number(publication_month)
    );

    if (!db_data.ok) {
      if (!db_data.data)
        return res.status(400).json({ message: "書籍の登録に失敗しました" });
      const { code, meta } = db_data.data;
      const target = meta?.target;
      if (code === "P2002" && target && target.includes("isbn"))
        return res
          .status(400)
          .json({ message: "そのISBNは既に登録されています" });
      console.log(code);
      return res.status(400).json({ message: "書籍の登録に失敗しました" });
    }

    return res.status(200).json({ message: "書籍を登録しました" });
  })
  .put("/", ...valCalls, async (req, res) => {
    const val = validationResult(req);
    if (!val.isEmpty())
      return res.status(400).json({
        message: val
          .array()
          .map((v) => v.msg)
          .join(", "),
      });

    const {
      isbn,
      title,
      author_id,
      publisher_id,
      publication_year,
      publication_month,
    } = req.body;

    const db_data = await db_updateBook(Number(isbn), {
      title,
      authorId: author_id,
      publisherId: publisher_id,
      publicationYear: Number(publication_year),
      publicationMonth: Number(publication_month),
    });

    if (!db_data.ok) {
      if (db_data.data?.code === "P2025")
        return res.status(400).json({ message: "存在しない書籍です" });
      return res.status(400).json({ message: "書籍の更新に失敗しました" });
    }

    return res.status(200).json({ message: "書籍を更新しました" });
  })
  .delete(
    "/",
    validateIsISBN("isbn"),

    async (req, res) => {
      const val = validationResult(req);
      if (!val.isEmpty())
        return res.status(400).json({
          message: val
            .array()
            .map((v) => v.msg)
            .join(", "),
        });

      const { isbn } = req.body;

      const db_data = await dbDeleteBook(isbn);

      if (!db_data.ok) {
        if (db_data.data?.code === "P2025")
          return res.status(400).json({ message: "存在しない書籍です" });
        return res.status(400).json({ message: "書籍の削除に失敗しました" });
      }

      return res.status(200).json({ message: "書籍を削除しました" });
    }
  );

export default router;
