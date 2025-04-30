import { Router } from "express";

const prefix = "/partials";
const router = Router();

router.use((req, res, next) => {
  if (req.header("HX-Request")) {
    return next();
  }
  console.warn("htmx requests only");
  res.sendStatus(400);
});

router.post("/clicked", (req, res) => {
  res.render("partials/clicked", { layout: false });
});

export { prefix, router };
