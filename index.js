const express = require("express");
const { doSomeHeavyTask } = require("./util");
const client = require("prom-client");
const responseTime = require("response-time");

const app = express();

require("dotenv").config();

const port = process.env.PORT || 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const reqResTime = new client.Histogram({
  name: "http_expres_req_res_time",
  help: "This tells how much time is taken by req and res",
  labelNames: ["method", "route", "status_code"],
});

app.use(
  responseTime((req, res, time) => {
    reqResTime
      .labels({
        method: req.method,
        route: req.url,
        status_code: req.statusCode,
      })
      .observe(time);
  })
);

app.get("/", (req, res) => {
  return res.status(200).send("Express server Running");
});

app.get("/slow", async (req, res) => {
  try {
    const timeTaken = await doSomeHeavyTask();
    return res.json({
      status: "success",
      message: `Heave task completed in ${timeTaken}ms`,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.get("/metrics", async (req, res) => {
  res.setHeader("content-type", client.register.contentType);
  return res.send(await client.register.metrics());
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
