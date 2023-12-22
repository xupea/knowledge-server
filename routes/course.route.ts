import Router from "@koa/router";

import courseController from "../controllers/course.controller";

const router = new Router();

router.get("/", courseController.getAll);

router.get("/:aid", courseController.getAllArticlesById);

export default router;
