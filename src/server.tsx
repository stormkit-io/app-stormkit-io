import React from "react";
import ReactDOMServer from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import express from "express";
import Root from "~/pages/Root";
import fs from "fs";
import path from "path";

const app = express();

app.get("*", (_: express.Request, res: express.Response) => {
  const htmlFile = fs
    .readFileSync(path.join(__dirname, "index.html"))
    .toString("utf8");

  const body = ReactDOMServer.renderToString(<Root Router={MemoryRouter} />);

  res.setHeader("content-type", "text/html; charset=utf-8");
  res.send(
    htmlFile
      .split(/<div id="root"><\/div>/)
      .join(`<div id="root">${body}</div>`)
  );
});

export default app;
