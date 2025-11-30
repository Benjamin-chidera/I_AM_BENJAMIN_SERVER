import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import router from "./router/route.ts";

const app = express();
const port = 3000;

app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
