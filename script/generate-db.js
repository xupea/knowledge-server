const fs = require("node:fs");
const path = require("node:path");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

const folderPath = "/Users/xiaomingxu/geektime-downloader/19290127644";

const isDirectory = ({ path }) => fs.lstatSync(path).isDirectory();
const isFile = ({ path }) => fs.lstatSync(path).isFile();

let courseId = 1000000;
let contentId = 1000000;

// replace .pdf or .ts in a string
const replace = (str) => str.replace(/\.[^.]+$/, "");

const iterateContent = (coursePath, cPath) =>
  fs
    .readdirSync(coursePath)
    .map((fileName) => ({
      fileName,
      path: path.join(coursePath, fileName),
    }))
    .filter(isFile)
    .map(({ fileName }) => ({
      id: contentId++,
      title: replace(fileName),
      path: ["", cPath, fileName].join("/"),
    }));

const result = fs
  .readdirSync(folderPath)
  .map((fileName) => ({
    fileName,
    path: path.join(folderPath, fileName),
    cPath: fileName,
  }))
  .filter(isDirectory)
  .map(({ fileName, path, cPath }) => ({
    id: courseId++,
    path,
    title: fileName,
    content: iterateContent(path, cPath),
  }));

db.defaults({ courses: result }).write();
