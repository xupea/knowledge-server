const fs = require("node:fs");
const nodePath = require("node:path");
const child = require("node:child_process");

const ffmpeg = require("ffmpeg-static");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

// const folderPath = path.join(process.cwd(), "public");
const folderPath = "/Users/xiaomingxu/geektime-downloader/19290127644";

const isDirectory = ({ path }) => fs.lstatSync(path).isDirectory();
const isFile = ({ path }) => fs.lstatSync(path).isFile();

let courseId = 1000000;
let contentId = 1000000;

// replace .pdf or .ts in a string
const replace = (str) => str.replace(/\.[^.]+$/, "");

const renameSpecialCharacters = (path) => {
  const specialChars = [
    { char: "&", replacement: "-" },
    { char: "{", replacement: "「" },
    { char: "}", replacement: "」" },
    { char: "[", replacement: "【" },
    { char: "]", replacement: "】" },
    { char: "(", replacement: "（" },
    { char: ")", replacement: "）" },
  ];

  let newPath = path;
  specialChars.forEach((specialChar) => {
    newPath = newPath.replace(
      new RegExp("\\" + specialChar.char, "g"),
      specialChar.replacement
    );
  });

  fs.renameSync(path, newPath, (err) => {
    if (err) {
      console.error("重命名失败:", err);
    } else {
      console.log("重命名成功！");
    }
  });
};

const iterateContent = (coursePath, cPath) =>
  fs
    .readdirSync(coursePath)
    .map((fileName) => ({
      fileName,
      path: nodePath.join(coursePath, fileName),
    }))
    .filter(({ fileName }) => !fileName.endsWith(".mp4"))
    .filter(isFile)
    .map(({ fileName, path }) => {
      if (fileName.endsWith(".ts")) {
        renameSpecialCharacters(path);

        const inputFile = path;
        // 输出文件
        const outputFile = nodePath.join(
          coursePath,
          `${replace(fileName)}.mp4`
        );

        if (!fs.existsSync(outputFile)) {
          // 调用 ffmpeg 命令
          console.log("converting", inputFile);
          child.execSync(
            `ffmpeg -i ${inputFile} -c:v libx264 ${outputFile} -loglevel error -y`
          );
        }
      }

      return {
        fileName: fileName.endsWith(".ts")
          ? replace(fileName) + ".mp4"
          : fileName,
        path,
      };
    })
    .map(({ fileName }) => ({
      id: contentId++,
      title: replace(fileName),
      path: ["", cPath, fileName].join("/"),
    }));

const result = fs
  .readdirSync(folderPath)
  .map((fileName) => ({
    fileName,
    path: nodePath.join(folderPath, fileName),
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
