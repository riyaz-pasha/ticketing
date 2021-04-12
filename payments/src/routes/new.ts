import { requireAuth, validateRequest } from '@riyazpasha/ticketing-common';
import { Request, Response, Router } from "express";
import { body } from 'express-validator';

const router = Router();

router.post(
    "/api/payments",
    requireAuth,
    [
        body("token")
            .notEmpty(),
        body("orderId")
            .notEmpty()
            .withMessage("please provide a valid orderId")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        res.send({ success: true })
    }
);

export {
    router as createChargeRouter,
};
