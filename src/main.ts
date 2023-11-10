import "./style.css";
import "./todo-list";

const template = document.createElement("template");
template.innerHTML = `
  <todo-list></todo-list>
`;
class AppContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(
      template.content.cloneNode(true),
    );
  }
}
customElements.define("app-container", AppContainer);
// import { setupCounter } from "./counter.ts";

// document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
//   <div>
//     <h1>Todo List</h1>
//     <todo-list>from list</todo-list>
//     <todo-item>task 1</todo-item>
//   </div>
// `;
//
// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
