document.addEventListener("alpine:init", () => {
  Alpine.data("catalogApp", () => ({

    state: {
      search: "",
      category: "all",
      reference: "all",
      page: 1,
      pageSize: 20
    },

    search: "",
    items: [],

    selectedCategories: [],
    selectedKatas: [],

    allCategories: [],
    allKatas: [],

    async init() {
      await this.loadItems();
      await this.extractFilters();
    },

    async loadItems() {
      const res = await fetch("data/techniques.json");
      this.items = await res.json();
    },

    async extractFilters() {
      const resCategories = await fetch("data/categories.json");
      const resKatas = await fetch("data/katas.json");

      this.allCategories = await resCategories.json();
      this.allKatas = await resKatas.json();
    },

    // -----------------------------
    // FILTERED ITEMS (orchestrator)
    // -----------------------------
    get filteredItems() {

      let results = this.items.filter(item =>
        this.matchesSearch(item) &&
        this.matchesCategories(item) &&
        this.matchesKatas(item)
      );

      return results;
    },

    // -----------------------------
    // SEARCH
    // -----------------------------
    matchesSearch(item) {
      const term = this.search.toLowerCase();

      return (
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term)
      );
    },

    // -----------------------------
    // CATEGORIES (AND logic)
    // -----------------------------
    matchesCategories(item) {
      if (this.selectedCategories.length === 0) return true;

      return this.selectedCategories.every(selectedId =>
        item.categories?.some(cat => cat === selectedId)
      );
    },

    // -----------------------------
    // KATAS (OR logic)
    // -----------------------------
    matchesKatas(item) {
      if (this.selectedKatas.length === 0) return true;

      return this.selectedKatas.some(selectedId =>
        item.katas?.some(k => k.kata === selectedId)
      );
    },

    // -----------------------------
    // SORTING
    // -----------------------------
    sortResults(results) {

      if (this.selectedKatas.length !== 1) return results;

      const selectedId = this.selectedKatas[0];

      return results.slice().sort((a, b) => {

        const aIndex = this.getKataIndex(a, selectedId);
        const bIndex = this.getKataIndex(b, selectedId);

        return aIndex - bIndex;
      });
    },

    getKataIndex(item, kataId) {
      const kata = item.katas?.find(k => k.kata === kataId);
      return kata?.index ?? Infinity;
    }

  }));
});