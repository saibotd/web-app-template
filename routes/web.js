import { Router } from "express";
import { Role, User } from "../app/models.js";
import { Op } from "sequelize";
import { auth } from "../app/helpers.js";

const prefix = "/";
const router = Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/user", async (req, res) => {
  auth(req, res);
  res.render("user");
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({
    where: {
      [Op.or]: {
        username: req.body.username,
        email: req.body.username,
      },
    },
    include: [Role],
  });
  if (user && user.checkPassword(req.body.password)) {
    req.session.user = {
      ...user.toJSON(),
      role: user.role.name,
    };
  }
  if (req.session.user) return res.redirect("/user");
  res.sendStatus(401);
});

router.all("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/login");
});

export { prefix, router };
