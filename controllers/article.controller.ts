import { Context } from "koa";
import httpStatus from "http-status";

const fs = require("node:fs");
const path = require("node:path");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const getArticleById = async (ctx: Context) => {
  const aid = ctx.params.aid;
  console.log(aid)
  const article = db
    .get("courses")
    .flatMap("content")
    .filter({ id: +aid })
    .head()
    .value();
  console.log(article);

  ctx.status = httpStatus.OK;
  ctx.body = article;
};

export default { getArticleById };
