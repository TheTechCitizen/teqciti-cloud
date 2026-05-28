// Role is to fetch one parent product and manage its array of variants
import { computed, ref, watch } from "vue";
import type { Catalog } from "~/schemas/catalog.schema";

export const useCatalog = () => {
  const catalogService = useDataService<Catalog>("catalog");

  const {
    data,
    pending,
    error,
  } = useAsyncData(`catalog-data`, async () => {
    // 2. CHANGE: Fetch by the parent `handle`, and deeply fetch all variants.
      const res = await catalogService.getAll();

      // Force it to be a valid array regardless of how Directus wraps it
      let items: Catalog[] = [];
      if (Array.isArray(res)) {
        items = res; // It's already an array
      } else if (res && Array.isArray(res.data)) {
        items = res.data; // It's wrapped in a 'data' object
      }

      return items;
    }
  );

  return {
    catalog: data,
    // We can do the filtering right here so your pages stay clean
    services: computed(() => (data.value || []).filter(c => c.type === 'service')),
    products: computed(() => (data.value || []).filter(c => c.type === 'product')),
    pending,
    error,  
  };
};
