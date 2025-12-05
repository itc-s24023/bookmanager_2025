import { Router } from "express";
import { validationResult } from "express-validator";
import { db_addRentalLog } from "../../bookManagerCore/db/rentalLogRepository.js";
import { db_getBookWithRentalLog } from "../../bookManagerCore/db/bookRepository.js";
import { validateIsISBN } from "../../bookManagerCore/requestValidator.js";

const router = Router();

router.post("/", validateIsISBN("book_id"), async (req, res) => {
  const val = validationResult(req);
  if (!val.isEmpty())
    return res.status(400).json({
      message: val
        .array()
        .map((v) => v.msg)
        .join(", "),
    });

  const { book_id } = req.body;

  const db_data = await db_getBookWithRentalLog(book_id, true);

  if (!db_data.ok)
    return res.status(500).json({ message: "サーバーエラーが発生しました" });
  if (!db_data.data)
    return res.status(400).json({ message: "書籍が存在しません" });
  if (db_data.data.rentalLogs.length > 0)
    return res.status(409).json({ message: "既に貸出中です" });

  const db_add = await db_addRentalLog(req.user!.id, book_id);
  if (!db_add.ok)
    return res.status(500).json({ message: "サーバーエラーが発生しました" });

  const rental = db_add.data;
  return res.status(200).json({
    id: rental.id,
    checkout_date: rental.checkoutDate,
    due_date: rental.dueDate,
  });
});

export default router;
