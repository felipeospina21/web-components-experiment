const template = document.createElement("template");
template.innerHTML = `
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
  </style>
  <div>
    <input placeholder="Enter task name" id="input"/>
  </div>
`;

class TodoInput extends HTMLElement {
  #shadow = this.attachShadow({ mode: "open" });

  constructor() {
    super();

    this.#shadow.append(template.content.cloneNode(true));
  }

  connectedCallback() {
    const input = this.#shadow.querySelector("input");
    if (input) {
      input.addEventListener("keyup", (e) => {
        e.preventDefault();
        if (e.key === "Enter") {
          this.dispatchEvent(
            new CustomEvent("onEnter", { detail: input.value }),
          );
          input.value = "";
        }
      });
    }
  }
}

window.customElements.define("todo-input", TodoInput);
