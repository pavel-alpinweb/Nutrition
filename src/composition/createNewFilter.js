import { useStore } from 'vuex';
import { computed } from 'vue';
import { eventBus } from '@/modules/utils';

export default function useCreateNewFilter() {
  const store = useStore();
  const productsNewOptions = {
    shop: '',
    category: '',
    grade: '',
    manufacturer: '',
  };

  const createNewFilter = (filter, selectedOption, product) => {
    console.log('filter', filter);
    let filtersTarget;
    switch (filter) {
      case 'category':
        filtersTarget = 'categories';
        break;
      case 'shop':
        filtersTarget = 'shops';
        break;
      case 'grade':
        filtersTarget = 'grades';
        break;
      case 'manufacturer':
        filtersTarget = 'manufacturers';
        break;
      default:
        break;
    }
    const filterArray = computed(() => store.state.products.fields[filtersTarget]);
    const newFilter = {
      name: productsNewOptions[filter],
      code: `${filter}-${filterArray.value.length + 1}`,
    };
    console.log('newFilter', productsNewOptions);
    store.commit('products/pushNewFilter', {
      filter: filtersTarget,
      value: newFilter,
    });
    productsNewOptions[filter] = '';
    // eslint-disable-next-line no-param-reassign
    selectedOption.value = newFilter;
    // eslint-disable-next-line no-param-reassign
    product[filter] = newFilter.name;
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
