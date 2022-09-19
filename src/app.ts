import "dotenv/config";
import express from "express";

import Crypto from "./routes/crypto.route";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set("view engine", "ejs");
// set folder "public" in express
app.use(express.static("public"));

app.use("/", Crypto);

export { app };
