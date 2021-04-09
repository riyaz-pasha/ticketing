import { Request, Response, Router } from "express";

const router = Router();

router.delete(
    "/api/orders/:orderId",
    async (req: Request, res: Response) => {
    }
)

export {
    router as deleteOrderRouter,
};
