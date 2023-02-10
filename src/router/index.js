import Vue from "vue";
import VueRouter from "vue-router";
import User from "../views/User.vue";
import Product from "../views/Product.vue";
import Main from "../views/Main.vue";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import { getToken } from "../utils/auth";
Vue.use(VueRouter);
//1.创建路由组件
const routes = [
  {
    path: "/",
    component: Main,
    redirect: "/home",
    children: [
      { path: "user", name: "user", component: User },
      { path: "product", name: "product", component: Product },
      { path: "home", name: "home", component: Home },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];
const router = new VueRouter({
  routes,
});
router.beforeEach((to, from, next) => {
  const token = getToken();
  if (!token && to.name !== "login") {
    next({ name: "login" });
  } else if (token && to.name === "login") {
    next({ name: "home" });
  } else {
    next();
  }
});
export default router;
