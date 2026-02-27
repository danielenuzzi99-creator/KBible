document.addEventListener("alpine:init", () => {
  Alpine.data("catalogApp", () => ({

    /*     let state = {
    search: "",
    category: "all",
    reference: "all",
    page: 1,
    pageSize: 20
  }; */

    search: "",
    items: [],

    async init() {
      const res = await fetch("catalog.json");
      this.items = await res.json();
    },

    get filteredItems() {
      const term = this.search.toLowerCase();

      return this.items.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term)
      );
    }
  }));
});