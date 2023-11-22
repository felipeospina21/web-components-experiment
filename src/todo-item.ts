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
  <input type="checkbox" id="checkbox"/>
  <slot></slot>
  <div class="actionButtonsContainer">
    <!-- <button id="done-button">done</button> -->
    <button id="delete-button">delete</button>
  </div>
</div>
`;

class TodoItem extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });
  #id: string;
  #checkbox: HTMLInputElement | null;
  _checked: boolean;
  _text: string;

  constructor() {
    super();
    this.#shadow.append(template.content.cloneNode(true));
    this.#id = "";
    this.#checkbox = this.#shadow.querySelector("#checkbox");
    this._checked = false;
    this._text = "";
  }

  connectedCallback() {
    this.#id = this.getAttribute("item-id") ?? "";
    this._checked = store.getItemById(this.#id)?.done ?? false;

    const checkbox = this.#shadow.querySelector("#checkbox");
    const deleteBtn = this.#shadow.querySelector("#delete-button");
    // const doneBtn = this.#shadow.querySelector("#done-button");

    // if (doneBtn) {
    //   doneBtn.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     this.dispatchEvent(new CustomEvent("onToggle", { detail: this.#id }));
    //   });
    // }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent("onRemove", { detail: this.#id }));
      });
    }

    if (checkbox) {
      checkbox.addEventListener("click", (e) => {
        // e.preventDefault();
        this.dispatchEvent(new CustomEvent("onToggle", { detail: this.#id }));
      });
    }
    this.#render();
  }

  disconnectCallback() {
    console.log("unmounted");
    this.#shadow.removeEventListener("click", (e) => {
      console.log(e);
    });
  }

  static get observedAttributes() {
    return ["text"];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log(name, oldValue, newValue);
    this._text = newValue;
  }

  set checked(value) {
    this._checked = Boolean(value);
  }

  get checked() {
    return this.hasAttribute("checked");
  }

  #render() {
    // console.log(this._checked, store.getItemById(this.#id));
    if (this._checked) {
      this.#checkbox?.setAttribute("checked", "");
    } else {
      this.#checkbox?.removeAttribute("checked");
    }
  }

  // static get observedAttributes() {
  //   return ["checked"];
  // }
  //
  // attributeChangedCallback(name: string, old: string, newVal: string) {
  //   const checkbox = this.#shadow.querySelector("#checkbox");
  //   // const isChecked = store.getItemById(this.#id)?.done;
  //   checkbox.checked = this.checked;
  //   console.log(name, old, newVal);
  // }
}

customElements.define("todo-item", TodoItem);
