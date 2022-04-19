import { useStore } from 'vuex';
import { computed } from 'vue';
import useOptions from '@/composition/selectOptions';

export default function useProductOptions() {
  const store = useStore();

  const categories = computed(() => store.state.products.filters.categories);
  const categoryOptions = useOptions(categories);

  const markets = computed(() => store.state.products.filters.shops);
  const marketOptions = useOptions(markets);

  const manufacturers = computed(() => store.state.products.filters.manufacturers);
  const manufacturerOptions = useOptions(manufacturers);

  const grades = computed(() => store.state.products.filters.varieties);
  const gradeOptions = useOptions(grades);

  const tags = computed(() => store.state.products.filters.tags);
  const tagsOptions = useOptions(tags);

  return {
    categoryOptions,
    marketOptions,
    manufacturerOptions,
    gradeOptions,
    tagsOptions,
  };
}
