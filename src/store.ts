const list = [{ id: "some-rand-id", name: "task 1", done: false }];

export type Item = { id: string; name: string; done: boolean };

export class Store {
  #store: Array<Item> = [];

  constructor() {
    this.#store = list;
  }

  getItems() {
    return this.#store;
  }

  getItemById(itemId: string) {
    return this.#store.find((element) => element.id === itemId);
  }

  addItem(item: Item) {
    this.#store.push(item);
  }

  deleteItem(itemId: string) {
    const newStore = this.#store.filter((item) => item.id !== itemId);
    this.#store = newStore;
  }

  updateItem(updatedItem: Item) {
    const newStore = this.#store.map((item) => {
      if (item.id === updatedItem.id) {
        return updatedItem;
      }
      return item;
    });
    this.#store = newStore;
  }
}

export const store = new Store();
