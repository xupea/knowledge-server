import Router from "@koa/router";

import courseRoute from "./course.route";
import articleRoute from "./article.route";

const rootRouter = new Router();

const defaultRoutes = [
  { path: "/courses", router: courseRoute },
  { path: "/articles", router: articleRoute },

];

defaultRoutes.forEach(({ path, router }) => {
  rootRouter.use(path, router.routes());
});

export default rootRouter;
