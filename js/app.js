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
      const res = await fetch("data/techniques.json");
      this.items = await res.json();

      await this.extractFilters();
    },

    async extractFilters() {
      const resCategories = await fetch("data/categories.json");
      const resKatas = await fetch("data/katas.json");

      this.allCategories = await resCategories.json();
      this.allKatas = await resKatas.json();
    },

    get filteredItems() {
      const term = this.search.toLowerCase();

      let results = this.items.filter(item => {

        // -----------------
        // 1️⃣ SEARCH
        // -----------------
        const matchesSearch =
          item.name?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term);

        if (!matchesSearch) return false;

        // -----------------
        // 2️⃣ CATEGORIES (AND)
        // -----------------
        const matchesCategories =
          this.selectedCategories.length === 0 ||
          this.selectedCategories.every(selectedId =>
            item.categories?.some(cat => cat === selectedId)
          );

        if (!matchesCategories) return false;

        // -----------------
        // 3️⃣ KATAS (OR)
        // -----------------
        const matchesKatas =
          this.selectedKatas.length === 0 ||
          this.selectedKatas.some(selectedId =>
            item.katas?.some(k => k.kata === selectedId)
          );

        if (!matchesKatas) return false;

        return true;
      });

      // -----------------------------
      // 4️⃣ SORT by kata index
      // Only if exactly ONE kata selected
      // -----------------------------
      if (this.selectedKatas.length === 1) {
        const selectedId = this.selectedKatas[0];

        results = results.slice().sort((a, b) => {

          const aKata = a.katas?.find(k => k.kata === selectedId);
          const bKata = b.katas?.find(k => k.kata === selectedId);

          const aIndex = aKata?.index ?? Infinity;
          const bIndex = bKata?.index ?? Infinity;

          return aIndex - bIndex;
        });
      }

      return results;
    }
  }));
});