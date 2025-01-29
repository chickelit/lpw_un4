import { Router } from "express";
import { SignInController } from "./controllers/sign-in.controller";
import { SignUpController } from "./controllers/sign-up.controller";
import { auth } from "./middleware/auth";

export const router = Router();

router.post("/sign-up", SignUpController.store);
router.put("/sign-up", SignUpController.update)

router.post("/sign-in", SignInController.store);
router.get("/sign-in", auth(), SignInController.show);
