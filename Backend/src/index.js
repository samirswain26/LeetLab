import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const app = express();

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App is listening on port : ${port}`);
});
