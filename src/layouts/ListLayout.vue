<template>
  <div class="list-layout p-grid">
    <div class="list-layout__sidebar p-fluid">
      <div class="list-layout__sidebar-top">
        <div class="p-field">
          <AutoComplete
            v-if="isSearchByName"
            v-model="searchString"
            id="search" type="search"
            :placeholder="searchPlaceholder"
            :suggestions="filteredSuggestions"
            field="name"
            @complete="searchFromSuggestions"
            @item-select="search"
            @clear="clearEmit"
          />
        </div>
        <div class="p-field">
          <Button
            label="Добавить"
            icon="fas fa-plus-circle"
            class="p-button-success"
            @click="addProduct"
          />
        </div>
        <div v-if="isShowReloadPrices" class="p-field">
          <Button
            label="Обновить цены"
            icon="pi pi-sync"
            class="p-button-warning"
            @click="reloadPrices"
          />
        </div>
      </div>
      <div class="list-layout__sidebar-bottom p-fluid">
        <div class="p-field">
          <label for="options">Сортировать</label>
          <Dropdown
            v-model="sortOptions.selectedOption.value"
            inputId="options"
            :options="sortOptions.options.value"
            optionLabel="name"
            placeholder="Сортировать по"
            @change="sort(sortOptions.selectedOption.value)"
          />
        </div>
        <div v-if="isShowCheckIHave" class="p-field-checkbox">
          <Checkbox id="isIHave" v-model="isIHave" :binary="true" @change="changeIHave(isIHave)"/>
          <label for="isIHave">Только имеющиеся у меня в наличии</label>
        </div>
        <div
          v-if="categoryOptionsArray.length > 0"
          class="p-field"
        >
          <label for="options2">Уточнение по категориям</label>
          <MultiSelect
            v-model="categoryOptions.selectedOption.value"
            inputId="options2"
            :options="category"
            :filter="true"
            optionLabel="name"
            placeholder="Уточнение по категориям"
            @change="filter('category', categoryOptions.selectedOption.value)"
          />
        </div>
        <div
          v-if="productTagOptionsArray.length > 0"
          class="p-field"
        >
          <label for="options2">Уточнение по тэгам</label>
          <MultiSelect
            v-model="productTagsOptions.selectedOption.value"
            inputId="options2"
            :options="productTags"
            :filter="true"
            optionLabel="name"
            placeholder="Уточнение по тэгам"
            @change="filter('tags', productTagsOptions.selectedOption.value)"
          />
        </div>
        <div
          v-if="dishesTagOptionsArray.length > 0"
          class="p-field"
        >
          <label for="options2">Уточнение по тэгам</label>
          <MultiSelect
            v-model="dishesTagsOptions.selectedOption.value"
            inputId="options2"
            :options="dishesTags"
            :filter="true"
            optionLabel="name"
            placeholder="Уточнение по тэгам"
            @change="filter('tags', dishesTagsOptions.selectedOption.value)"
          />
        </div>
        <div
          v-if="menusTagOptionsArray.length > 0"
          class="p-field"
        >
          <label for="options2">Уточнение по тэгам</label>
          <MultiSelect
            v-model="menusTagsOptions.selectedOption.value"
            inputId="options2"
            :options="menusTags"
            :filter="true"
            optionLabel="name"
            placeholder="Уточнение по тэгам"
            @change="filter('tags', menusTagsOptions.selectedOption.value)"
          />
        </div>
        <div
          v-if="marketsOptionsArray.length > 0"
          class="p-field"
        >
          <label for="options3">Магазины</label>
          <MultiSelect
            v-model="marketsOptions.selectedOption.value"
            inputId="options3"
            :options="markets"
            :filter="true"
            optionLabel="name"
            placeholder="Магазины"
            @change="filter('shops', marketsOptions.selectedOption.value)"
          />
        </div>
        <div
          v-if="gradesOptionsArray.length > 0"
          class="p-field"
        >
          <label for="options4">Сорта</label>
          <MultiSelect
            v-model="gradesOptions.selectedOption.value"
            inputId="options4"
            :options="grades"
            :filter="true"
            optionLabel="name"
            placeholder="Сорта"
            @change="filter('grades', gradesOptions.selectedOption.value)"
          />
        </div>
        <div
          v-if="manufacturersOptionsArray.length > 0"
          class="p-field"
        >
          <label for="options4">Производители</label>
          <MultiSelect
            v-model="manufacturersOptions.selectedOption.value"
            inputId="options4"
            :options="manufacturers"
            :filter="true"
            optionLabel="name"
            placeholder="Производители"
            @change="filter('manufacturers', manufacturersOptions.selectedOption.value)"
          />
        </div>
        <div
          v-if="dishesOptionsArray.length > 0"
          class="p-field"
        >
          <label for="options5">Блюда</label>
          <MultiSelect
            v-model="dishesOptions.selectedOption.value"
            inputId="options5"
            :options="dishes"
            :filter="true"
            optionLabel="name"
            placeholder="Блюда"
            @change="filter('dishNames', dishesOptions.selectedOption.value)"
          />
        </div>
        <div
          v-if="productsOptionsArray.length > 0"
          class="p-field"
        >
          <label for="options6">Продукты</label>
          <MultiSelect
            v-model="productsOptions.selectedOption.value"
            inputId="options6"
            :options="productNames"
            :filter="true"
            optionLabel="name"
            placeholder="Продукты"
            @change="filter('productCategories', productsOptions.selectedOption.value)"
          />
        </div>
      </div>
    </div>
    <div class="p-col-9 list-layout__content p-offset-3">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import AutoComplete from 'primevue/autocomplete';
import useOptions from '@/composition/selectOptions';
import { useStore } from 'vuex';

export default {
  name: 'ListLayout',
  components: {
    Button,
    MultiSelect,
    Checkbox,
    Dropdown,
    AutoComplete,
  },
  props: {
    isSearchByName: {
      type: Boolean,
      default: false,
    },
    isShowReloadPrices: {
      type: Boolean,
      default: false,
    },
    isShowCheckIHave: {
      type: Boolean,
      default: false,
    },
    productTagOptionsArray: {
      type: Array,
      default: () => [],
    },
    dishesTagOptionsArray: {
      type: Array,
      default: () => [],
    },
    menusTagOptionsArray: {
      type: Array,
      default: () => [],
    },
    categoryOptionsArray: {
      type: Array,
      default: () => [],
    },
    marketsOptionsArray: {
      type: Array,
      default: () => [],
    },
    gradesOptionsArray: {
      type: Array,
      default: () => [],
    },
    manufacturersOptionsArray: {
      type: Array,
      default: () => [],
    },
    productsOptionsArray: {
      type: Array,
      default: () => [],
    },
    dishesOptionsArray: {
      type: Array,
      default: () => [],
    },
    searchArray: {
      type: Array,
      default: () => [],
    },
    searchPlaceholder: {
      type: String,
      default: 'Название',
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const isIHave = ref(false);
    const searchString = ref();
    const filteredSuggestions = ref();
    const sortOptions = useOptions([
      { name: 'По цене по возрастанию', code: 'price_asc' },
      { name: 'По цене по убыванию', code: 'price_desc' },
    ]);
    const productTagsOptions = useOptions(props.productTagOptionsArray);
    const dishesTagsOptions = useOptions(props.dishesTagOptionsArray);
    const menusTagsOptions = useOptions(props.menusTagOptionsArray);
    const categoryOptions = useOptions(props.categoryOptionsArray);
    const marketsOptions = useOptions(props.marketsOptionsArray);
    const gradesOptions = useOptions(props.gradesOptionsArray);
    const manufacturersOptions = useOptions(props.manufacturersOptionsArray);
    const productsOptions = useOptions(props.productsOptionsArray);
    const dishesOptions = useOptions(props.dishesOptionsArray);

    const category = computed(() => store.state.products.filters.categories);
    const productTags = computed(() => store.state.products.filters.tags);
    const dishesTags = computed(() => store.state.dishes.filters.dishTags);
    const menusTags = computed(() => store.state.menus.filters.menuTags);
    const markets = computed(() => store.state.products.filters.shops);
    const grades = computed(() => store.state.products.filters.grades);
    const dishes = computed(() => store.state.menus.filters.dishNames);
    const manufacturers = computed(() => store.state.products.filters.manufacturers);
    const productNames = computed(() => store.state.dishes.filters.productCategories);

    const changeIHave = (ihave) => {
      emit('change', ihave);
    };
    const addProduct = () => {
      emit('add');
    };
    const reloadPrices = () => {
      emit('reload');
    };
    const sort = (value) => {
      emit('sort', value);
    };
    const filter = (key, value) => {
      emit('filter', {
        key,
        value,
      });
    };
    const searchFromSuggestions = (event) => {
      setTimeout(() => {
        if (!event.query.trim().length) {
          filteredSuggestions.value = [...props.searchArray];
        } else {
          filteredSuggestions.value = props.searchArray
            .filter((item) => item.name.toLowerCase().startsWith(event.query.toLowerCase()));
        }
      }, 250);
    };
    const search = () => {
      emit('search', searchString.value.name);
    };
    const clearEmit = () => {
      emit('clearSearch');
    };
    return {
      searchString,
      isIHave,
      sortOptions,
      productTagsOptions,
      dishesTagsOptions,
      menusTagsOptions,
      marketsOptions,
      gradesOptions,
      manufacturersOptions,
      productsOptions,
      dishesOptions,
      categoryOptions,
      changeIHave,
      addProduct,
      reloadPrices,
      sort,
      filter,
      search,
      searchFromSuggestions,
      clearEmit,
      category,
      productTags,
      dishesTags,
      menusTags,
      dishes,
      markets,
      grades,
      manufacturers,
      productNames,
      filteredSuggestions,
    };
  },
};
</script>

<style lang="scss" scoped>
  .list-layout {
    padding: 8px;
    margin-top: 10px;
    background-color: var(--surface-b);
    &__sidebar {
      border: 1px solid #ccc;
      position: fixed;
      height: calc(100% - 145px);
      padding: 10px;
      width: 295px;
      overflow-y: auto;
      overflow-x: hidden;
    }
    &__content {
      overflow: auto;
    }
    &__sidebar-top {
      border-bottom: 1px solid #ccc;
    }
    &__sidebar-bottom {
      padding: 10px 0;
    }
  }
</style>
