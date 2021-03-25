import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body("email")
            .isEmail()
            .withMessage("Email must be valid!."),
        body("password")
            .notEmpty()
            .withMessage("Please provide password")
    ],
    validateRequest,
    (req: Request, res: Response) => {

        res.send("Hi There.. signin successful");
    });

export {
    router as signinRouter,
};
