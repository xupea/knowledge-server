import { Context } from "koa";
import httpStatus from "http-status";

const fs = require("node:fs");
const path = require("node:path");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const getAll = async (ctx: Context) => {
  const courses = db.get("courses").value();
  console.log(courses);

  ctx.status = httpStatus.OK;
  ctx.body = courses;
};

const getArticleById = async (ctx: Context) => {
  const aid = ctx.params.aid;
  const courses = db.get("courses").value();
  console.log(courses);

  ctx.status = httpStatus.OK;
  ctx.body = courses;
};

const getAllArticlesById = async (ctx: Context) => {
  const aid = ctx.params.aid;
  const course = db
    .get("courses")
    .filter((course: any) =>
      course.content.some((item: any) => item.id === +aid)
    )
    .head()
    .value();
  console.log(course);

  ctx.status = httpStatus.OK;
  ctx.body = course;
};

export default { getAll, getAllArticlesById };
