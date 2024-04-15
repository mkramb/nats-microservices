import express from "express";

const app = express();
const port = process.env.PORT ?? 3000;

app.get("/ping", (req, res) => {
  res.send("Pong");
});

app.listen(port, () => {
  console.log(`Service listening on port ${port}`);
});
