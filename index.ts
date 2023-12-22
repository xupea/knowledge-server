import Koa from "koa";
import helmet from "koa-helmet";
import { koaBody } from "koa-body";
import cors from "@koa/cors";

import rootRouter from "./routes/";
import koaStatic from "./middlewares/static";

const app = new Koa();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(koaBody());

// enable cors
app.use(cors());

// serve public static files
app.use(koaStatic());

// v1 api routes
app.use(rootRouter.routes());

app.listen(8080);
