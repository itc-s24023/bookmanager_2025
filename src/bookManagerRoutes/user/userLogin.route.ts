import { Router } from "express";

import passport from "../../bookManagerCore/passportAuth.js";  

const router = Router();



const authCall = passport.authenticate('local', {
    failureMessage: true,
    badRequestMessage: 'ユーザー名とパスワードを入力してください',
});


router.post("/",
    authCall,
    async (req, res) => {
        res.json({ message: "ok" })
    }
);

export default router;