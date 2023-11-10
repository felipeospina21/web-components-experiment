import { store } from "./store";

const template = document.createElement("template");
template.innerHTML = `
<style>
  .todoItem {
    background:#fff;
    height: 3rem;
    border: 1px solid ;
    border-color: rgba(0,0,0,0.05);
    border-radius:6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem;
   }

   .actionButtonsContainer {
    display: flex;
    justify-content:space-around;
    align-items: center;
    width: 30%;
   }
</style>
<div class="todoItem">
  <slot></slot>
  <div class="actionButtonsContainer">
    <button id="done-button">done</button>
    <button id="delete-button">delete</button>
  </div>
</div>
`;
class TodoItem extends HTMLElement {
  _shadow = this.attachShadow({ mode: "open" });
  constructor() {
    super();
    this._shadow.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    this._shadow.addEventListener("click", this.#deleteTodoItem.bind(this));
  }

  #deleteTodoItem(e: Event) {
    if (e instanceof MouseEvent && e.target instanceof HTMLButtonElement) {
      const id = e.target.id;
      switch (id) {
        case "delete-button":
          store.deleteItem(id);
          break;

        default:
          break;
      }
    }
    // this.shadowRoot?.removeChild(this.shadowRoot.querySelector("#delete-button"))
  }
}

customElements.define("todo-item", TodoItem);
