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

  .todoText{
    display:flex;
    flex:1;
    margin:0 1rem;
    font-size:1.25rem;
    }

  .done {
      text-decoration:line-through;
      font-style:italic;
		  color: #888;
    }

  .actionButtonsContainer {
    display: flex;
    justify-content:space-around;
    align-items: center;
    margin: 0 1rem;
   }

  button {
    all:unset;
    display: flex;
    align-items: center;
  }

  button:hover {
      cursor:pointer;
  }

  img {
    width:20px;
  }

  input {
    width:1.25rem;
    height:1.25rem;
  }
</style>

<div class="todoItem">
  <input type="checkbox" id="checkbox"/>
  <slot class="todoText"></slot>
  <div class="actionButtonsContainer">
    <button id="delete-button">
      <img src="/trash-can-32.png"/> 
    </button>
  </div>
</div>
`;

class TodoItem extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });
  #id: string;
  isChecked: boolean;

  constructor() {
    super();
    this.#shadow.append(template.content.cloneNode(true));
    this.#id = "";
    this.isChecked = false;

    const checkbox = this.#shadow.querySelector("#checkbox");
    const deleteBtn = this.#shadow.querySelector("#delete-button");
    const todoItem = this.#shadow.querySelector(".todoItem");

    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent("onRemove", { detail: this.#id }));
      });
    }

    if (checkbox) {
      checkbox.addEventListener("click", (e) => {
        const input = e.target as HTMLInputElement;
        this.isChecked = input.checked;
        this.toggleDoneClass(todoItem);
        this.dispatchEvent(new CustomEvent("onToggle", { detail: this.#id }));
      });
    }
  }

  toggleDoneClass(todoItem: Element | null) {
    if (this.isChecked) {
      todoItem?.classList.add("done");
    } else {
      todoItem?.classList.remove("done");
    }
  }

  connectedCallback() {
    this.#id = this.getAttribute("item-id") ?? "";
  }
}

customElements.define("todo-item", TodoItem);
