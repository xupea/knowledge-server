import Router from "@koa/router";

import articleController from "../controllers/article.controller";

const router = new Router();

router.get("/:aid", articleController.getArticleById);

export default router;
