import "./todo-item";
import "./todo-input";
import { Item, store } from "./store.ts";

const template = document.createElement("template");
template.innerHTML = `
<style>
  div {
    width:50%;
    max-width: 700px;
    margin: auto;
    background-color:#f9f9f9;
    padding:1rem 2rem 4rem 2rem;
    border-radius:10px;
    box-shadow: 7px 7px 5px 0px rgba(50, 50, 50, 0.75);
  }

	section {
	  display:flex;
	  flex-direction: column;
	  margin: 1.5rem 0;
	}

	section > *{
	  margin:0.5rem 0;

	}
</style>
<div class="app-container">
  <h1>TODO LIST</h1>
  <todo-input></todo-input>
  <section></section>
</div>
`;

class TodoList extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });
  #section: HTMLElement | null = null;
  items: Item[];

  constructor() {
    super();

    this.#shadow.append(template.content.cloneNode(true));
    const input = this.#shadow.querySelector("todo-input");
    if (input) {
      input.addEventListener("onEnter", this.addItem.bind(this));
    }

    this.#section = this.#shadow.querySelector("section");
    this.items = [];

    this.#render();
  }

  static get observedAttributes() {
    return ["loading"];
  }

  get loading() {
    const attr = this.getAttribute("loading");
    if (attr) {
      return JSON.parse(attr);
    }
    return false;
  }

  set loading(v) {
    this.setAttribute("loading", JSON.stringify(v));
  }

  attributeChangedCallback() {
    this.#render();
  }

  async connectedCallback() {
    this.loading = true;
    const items = await store.getItems();
    this.items = items;
    this.loading = false;
  }

  async addItem(e: Event) {
    if ("detail" in e) {
      await store.addItem({
        message: e.detail as string,
      });
      this.#render();
    }
  }

  async removeItem(e: Event) {
    if ("detail" in e) {
      await store.deleteItem(e.detail as string);
      const todoItem = this.#shadow.querySelector(`[item-id='${e.detail}']`);
      todoItem?.remove();
    }
  }

  async toggleItem(e: Event) {
    if ("detail" in e) {
      const item = store.getItemById(e.detail as string);
      if (item) {
        await store.updateItem({ done: !item.done }, item["item_id"]);
      }
    }
  }

  async #render() {
    const section = this.#section;

    if (this.loading) {
      const div = document.createElement("div");
      div.innerText = `Loading...`;
      div.setAttribute("loader", "true");
      section?.appendChild(div);
    } else {
      if (section) {
        const loader = this.#shadow.querySelector("[loader='true']");
        loader?.remove();

        this.items.forEach((element) => {
          const todoItem = this.#shadow.querySelector(
            `[item-id='${element["item_id"]}']`,
          );
          if (!todoItem) {
            this.#createTodoItem(section, element);
          }
        });
      }
    }
  }

  #createTodoItem(section: HTMLElement, item: Item) {
    const todoItem = document.createElement("todo-item");
    todoItem.textContent = item.message;
    todoItem.setAttribute("item-id", item["item_id"] ?? "");
    todoItem?.setAttribute("done", String(item.done));
    todoItem.addEventListener("onRemove", this.removeItem.bind(this));
    todoItem.addEventListener("onToggle", this.toggleItem.bind(this));
    section?.appendChild(todoItem);
  }
}

customElements.define("todo-list", TodoList);
