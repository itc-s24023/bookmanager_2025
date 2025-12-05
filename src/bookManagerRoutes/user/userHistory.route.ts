import { Router } from "express";
import { db_getRentalLogByUserId } from "../../bookManagerCore/db/rentalLogRepository.js";

const router = Router();


router.get("/", async (req, res) => {
    const user = req.user;

    const db_data = await db_getRentalLogByUserId(user!.id);

    if (!db_data.ok) return res.status(404).json({ reason: "履歴の取得に失敗しました" });

    const history = db_data.data.map(history => {
        const { book } = history;
        return {
            ...history,
            book: {
                name: book.title,
                isbn: Number(book.isbn),
            }
        }
    });

    res.json({ history });
});

export default router;