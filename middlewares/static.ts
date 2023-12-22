import serve from "koa-static";
import path from "path";

const koaStatic = () => serve(path.join(__dirname, "../../public"));

export default koaStatic;
