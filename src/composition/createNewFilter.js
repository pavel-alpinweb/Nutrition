import { useStore } from 'vuex';
import { computed, reactive } from 'vue';
import { eventBus } from '@/modules/utils';

export default function useCreateNewFilter() {
  const store = useStore();
  const productsNewOptions = reactive({
    market: '',
    category: '',
    grade: '',
    manufacturer: '',
  });

  const createNewFilter = (filter, selectedOption) => {
    let filtersTarget;
    switch (filter) {
      case 'category':
        filtersTarget = 'categories';
        break;
      case 'market':
        filtersTarget = 'shops';
        break;
      case 'grade':
        filtersTarget = 'varieties';
        break;
      case 'manufacturer':
        filtersTarget = 'manufacturers';
        break;
      default:
        break;
    }
    const filterArray = computed(() => store.state.products.filters[filtersTarget]);
    const newFilter = {
      name: productsNewOptions[filter],
      code: `${filter}-${filterArray.value.length + 1}`,
    };
    store.commit('products/pushNewFilter', {
      filter: filtersTarget,
      value: newFilter,
    });
    productsNewOptions[filter] = '';
    // eslint-disable-next-line no-param-reassign
    selectedOption.value = newFilter;
    eventBus.emit('showToast', {
      severity: 'success',
      summary: 'Новая категория добавлена',
      detail: 'Новая категория добавлена в список',
      life: 3000,
    });
  };

  return {
    productsNewOptions,
    createNewFilter,
  };
}
