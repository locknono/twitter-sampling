import * as Koa from "koa";
import * as Router from "koa-router";

const PORT = 5000;
const app = new Koa();
const router = new Router();

router.get("/*", async ctx => {
  ctx.body = "Hello World!";
});

app.use(router.routes());

app.listen(PORT);

console.log(`Server running on port ${PORT}`);
