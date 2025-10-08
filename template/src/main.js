import { mount } from "svelte";
import "./lib/style/global.scss";
import App from "./App.svelte";

const app = mount(App, {
  target: document.getElementById("app"),
});

export default app;
