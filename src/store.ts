const list = [{ id: "some-rand-id", name: "task 1", done: false }];

type Item = { id: string; name: string; done: boolean };

export class Store {
  #store: Array<Item> = [];

  constructor() {
    this.#store = list;
  }

  getItems() {
    return this.#store;
  }

  addItem(item: Omit<Item, "id">) {
    const id = crypto.randomUUID();
    const newItem = { ...item, id };
    this.#store.push(newItem);
  }

  deleteItem(itemId: string) {
    const newStore = this.#store.filter((item) => item.id !== itemId);
    this.#store = newStore;
  }
}

export const store = new Store();
