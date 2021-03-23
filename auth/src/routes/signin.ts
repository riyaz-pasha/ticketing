import express from "express";

const router = express.Router();

router.post("/api/users/signin", (req, res) => {
    res.send("Hi There.. signin successful");
});

export {
    router as signinRouter,
};
