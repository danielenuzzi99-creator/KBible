function catalogApp() {
  return {
    items: [],
    search: "",

    async init() {
      const res = await fetch("catalog.json");
      this.items = await res.json();
    },

    get filteredItems() {
      return this.items.filter(item =>
        item.name.toLowerCase().includes(this.search.toLowerCase()) ||
        item.description.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  };
}