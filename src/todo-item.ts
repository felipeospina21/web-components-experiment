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
  #todoItem: Element | null;
  #checkbox: HTMLInputElement | null;
  isChecked: boolean;

  constructor() {
    super();
    this.#shadow.append(template.content.cloneNode(true));
    this.#id = "";
    this.isChecked = false;
    this.#todoItem = this.#shadow.querySelector(".todoItem");
    this.#checkbox = this.#shadow.querySelector("#checkbox");

    const deleteBtn = this.#shadow.querySelector("#delete-button");

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("onRemove", { detail: this.#id }));
      });
    }

    if (this.#checkbox) {
      this.#checkbox.addEventListener("change", (e) => {
        const input = e.target as HTMLInputElement;
        this.setAttribute("done", String(input.checked));
        this.dispatchEvent(new CustomEvent("onToggle", { detail: this.#id }));
      });
    }
  }

  static get observedAttributes() {
    return ["done"];
  }

  attributeChangedCallback(name: string, _: string, newVal: string) {
    if (name === "done") {
      if (newVal === "true") {
        this.#todoItem?.classList.add("done");
      } else {
        this.#todoItem?.classList.remove("done");
      }
    }
  }

  connectedCallback() {
    this.#id = this.getAttribute("item-id") ?? "";
    this.isChecked = this.getAttribute("done") === "true" ? true : false;

    this.#render();
  }

  #render() {
    if (this.isChecked) {
      this.#todoItem?.classList.add("done");
      this.#checkbox?.setAttribute("checked", "");
    } else {
      this.#todoItem?.classList.remove("done");
      this.#checkbox?.removeAttribute("checked");
    }
  }
}

customElements.define("todo-item", TodoItem);
