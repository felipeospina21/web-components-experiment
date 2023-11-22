import "./todo-item";
import "./todo-input";
import { Item, store } from "./store.ts";

const template = document.createElement("template");
template.innerHTML = `
<style>
  div {
    display:flex;
    flex-direction: column;
    width:fit;
  }
	section {
	    display:flex;
	    flex-direction: column;
	    padding:0 1rem;
	}
	section > *{
	  margin:0.5rem 0;

	}
</style>
<div>
  <h1>Todo List</h1>
  <todo-input></todo-input>
  <section></section>
</div>
`;

class TodoList extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });
  #section: HTMLElement | null = null;

  constructor() {
    super();

    this.#shadow.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    const input = this.#shadow.querySelector("todo-input");
    if (input) {
      input.addEventListener("onEnter", this.addItem.bind(this));
    }

    this.#section = this.#shadow.querySelector("section");

    this.#render();
  }

  disconnectCallback() {
    console.log("unmounted");
    this.#shadow.removeEventListener("onEnter", this.addItem.bind(this));
    this.#shadow.addEventListener("onRemove", this.removeItem.bind(this));
    this.#shadow.addEventListener("onToggle", this.toggleItem.bind(this));
  }

  addItem(e: Event) {
    if ("detail" in e) {
      store.addItem({
        id: crypto.randomUUID(),
        name: e.detail as string,
        done: false,
      });
      this.#render();
    }
  }

  removeItem(e: Event) {
    if ("detail" in e) {
      store.deleteItem(e.detail as string);
      const section = this.#section;
      const todoItem = this.#shadow.querySelector(`[item-id='${e.detail}']`);
      if (section && todoItem) {
        section.removeChild(todoItem);
        // this.#render();
      }
    }
  }

  toggleItem(e: Event) {
    if ("detail" in e) {
      const item = store.getItemById(e.detail as string);
      // console.log(item);
      if (item) {
        store.updateItem({ ...item, done: !item.done });
        this.#render();
      }
    }
  }

  #render() {
    const section = this.#section;
    const items = store.getItems();

    if (section) {
      items.forEach((element) => {
        const todoItem = this.#shadow.querySelector(
          `[item-id='${element.id}']`,
        );
        // console.log(element);
        if (!todoItem) {
          this.#createTodoItem(section, element);
        }
      });
      this.#shadow.appendChild(section);
    }
  }

  #createTodoItem(section: HTMLElement, item: Item) {
    const todoItem = document.createElement("todo-item");
    todoItem.textContent = item.name;
    // (todoItem as HTMLInputElement).checked = item.done;
    todoItem.setAttribute("item-id", item.id);
    todoItem.addEventListener("onRemove", this.removeItem.bind(this));
    todoItem.addEventListener("onToggle", this.toggleItem.bind(this));
    section?.appendChild(todoItem);
  }
}

customElements.define("todo-list", TodoList);
