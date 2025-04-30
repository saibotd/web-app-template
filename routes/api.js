import { Router } from "express";
import { DateTime } from "luxon";

const prefix = "/api";
const router = Router();

router.get("/server-time", (req, res) => {
  res.json({ time: DateTime.now() });
});

export { prefix, router };
