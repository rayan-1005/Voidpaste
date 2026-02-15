import {
  createPaste,
  getPaste,
  deletePaste,
} from "../controllers/controller.paste.js";
import express from "express";

const router = express.Router();

router.post("/", createPaste);
router.get("/:id", getPaste);
router.delete("/:id", deletePaste);

export default router;
