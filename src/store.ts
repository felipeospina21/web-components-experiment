export type Item = {
  ID?: number;
  message: string;
  done?: boolean;
  item_id?: string;
};

class Store {
  #store: Array<Item> = [];
  url: string;

  constructor() {
    this.url = "http://localhost:8080/api/todo";
  }

  async getItems(): Promise<Item[]> {
    const res = await fetch(this.url);
    const json = await res.json();
    this.#store = json as Item[];
    return json;
  }

  getItemById(itemId: string) {
    return this.#store.find((element) => element["item_id"] === itemId);
  }

  async addItem(item: Item) {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    const json: Item = await res.json();
    this.#store.push(json);
  }

  async deleteItem(itemId: string) {
    const res = await fetch(this.url + `/${itemId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const json: Item = await res.json();
    console.log(json);
  }

  async updateItem(updatedItem: Pick<Item, "done">, id: string | undefined) {
    if (!id) {
      return;
    }
    const res = await fetch(this.url + `/${id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedItem),
    });
    await res.json();
  }
}

export const store = new Store();
