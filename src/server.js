import express from "express";
import session from "express-session";
import { DateTime } from "luxon";
import bodyParser from "body-parser";
import connect from "connect-session-sequelize";
import { Sequelize } from "sequelize";
import expressLayouts from "express-ejs-layouts";
import vite from "./vite.js";
import fs from "node:fs";

const sessionStore = connect(session.Store);

const sessionDB = new Sequelize({
  dialect: "sqlite",
  storage: "./data/sessions.sqlite",
  logging: false,
});

const app = express();

app
  .set("trust proxy", 1)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(
    session({
      secret: process.env.SECRET,
      resave: false,
      proxy: true,
      saveUninitialized: false,
      store: new sessionStore({
        db: sessionDB,
      }),
      cookie: {
        sameSite: "lax",
        secure: process.env.ENVIRONMENT == "prod",
        maxAge: 90 * 24 * 60 * 60 * 1000,
      },
    }),
  )
  .use((req, res, next) => {
    res.locals.DateTime = DateTime;
    res.locals.user = req.session.user || null;
    res.locals.environment = process.env.ENVIRONMENT;
    res.locals.base_url = process.env.BASE_URL;
    res.locals.vite = vite;
    if (res.locals.user) res.setHeader("cache-control", "private, no-cache");
    next();
  })
  .set("view engine", "ejs")
  .use(expressLayouts)
  .set("layout", "layouts/default")
  .set("etag", false)
  .use(express.static("static"))
  .use(express.static("dist"))
  .set("views", "views");

for (const routerFile of fs.readdirSync("./routes")) {
  const { router, prefix } = await import(`../routes/${routerFile}`);
  app.use(prefix, router);
}

app.use((req, res, next) => {
  res.format({
    text: function () {
      res.status(404).send("Not found!");
    },
    html: function () {
      res.status(404).render("404");
    },
    json: function () {
      res.status(404).json({ message: "Not found!" });
    },
  });
});

sessionDB.sync();

const host = process.env.HTTP_HOST || "localhost";
const port = process.env.HTTP_PORT || 5000;

export default function startServer() {
  return app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
  });
}
