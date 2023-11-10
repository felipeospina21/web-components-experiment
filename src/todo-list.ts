import "./todo-item";
import { store } from "./store.ts";

// const list = [
//   { name: "task 1", done: false },
//   { name: "task 2", done: false },
//   { name: "task 3", done: false },
// ];

class TodoList extends HTMLElement {
  _shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();

    const temp = document.createElement("template");
    temp.innerHTML = `
      <style>
        div {
          display:flex;
          flex-direction: column;
          width:fit;
        }
        input{ 
		      padding: 1rem 1.5rem;
		      font-size: 1.5rem;
		      min-width: 5rem; /* safari/FF != chrome, so normalize */
		      outline: none;
		      border: none;
		      border-radius: 4px;
		      box-shadow: var(--elev-2); 
	      }

	      input::placeholder{
		      color: #888;
		      font-family: roboto;
		      font-weight: 300;
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
        <input placeholder="Enter task name" id="input"/>
      </div>
`;

    this._shadow.append(temp.content.cloneNode(true));
  }

  connectedCallback() {
    const items = store.getItems();

    const section = document.createElement("section");
    items.forEach((element) => {
      this.#createTodoItem(section, element.name);
    });
    this._shadow.appendChild(section);

    this._shadow.addEventListener("keyup", this.handleInputChange.bind(this));
  }

  handleInputChange(e: Event) {
    if (e instanceof KeyboardEvent && e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      store.addItem({ name: target.value, done: false });

      const section = this._shadow.querySelector("section");
      if (section) {
        this.#createTodoItem(section, target.value);
      }
    }
  }

  #createTodoItem(section: HTMLElement, todoText: string) {
    const todoItem = document.createElement("todo-item");
    todoItem.textContent = todoText;
    section?.appendChild(todoItem);
  }
}

customElements.define("todo-list", TodoList);
