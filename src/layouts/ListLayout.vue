<template>
  <div class="list-layout p-grid">
    <Button
      :class="[
        'list-layout__btn laptops-hide all-desktops-hide',
        { 'list-layout__btn--open': isOpenSidebar },
      ]"
      type="button"
      icon="fas fa-tasks"
      label="Фильтры"
      @click="toggleSidebar"
    >
    </Button>
    <div :class="[
      'list-layout__sidebar p-fluid',
      { 'list-layout__sidebar--open': isOpenSidebar },
    ]">
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
        <div class="p-field">
          <div v-if="isShowReloadPrices" class="p-field">
            <Button
              label="Обновить цены"
              icon="pi pi-sync"
              class="p-button-warning"
              @click="reloadPrices"
            />
          </div>
        </div>
      </div>
      <div class="list-layout__sidebar-bottom p-fluid">
        <div v-if="isShowClearFilters" class="p-field">
          <Button
            label="Очистить фильтры"
            icon="pi pi-filter-slash"
            class="p-button-secondary"
            @click="clearFilters"
          />
        </div>
        <div v-if="isShowSort" class="p-field">
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
        <div class="p-field">Режим фильтров:</div>
        <div v-if="isShowFiltersModeSwitcher" class="list-layout__filters-visible-mode p-field">
          <span class="p-buttonset">
            <Button label="Список" icon="fas fa-list" @click="switchSelectMode('list')"/>
            <Button label="Дерево" icon="fas fa-stream" @click="switchSelectMode('tree')"/>
        </span>
        </div>
        <div v-if="!isShowTreeFilters" class="list-layout__filters-list">
          <div
            v-for="(item, key) in filtersArray"
            :key="key"
            class="p-field"
          >
            <label :for="`filter_${key}`">{{ item.label }}</label>
            <MultiSelect
              v-model="filtersOptions[item.field].selectedOption"
              :inputId="`filter_${key}`"
              :options="item.options"
              :filter="true"
              optionLabel="name"
              placeholder="Уточнение по названию"
              @change="filter(item.field, filtersOptions[item.field].selectedOption)"
            />
          </div>
        </div>
        <div v-if="isShowTreeFilters" class="list-layout__filters-list">
          <TreeSelect
            v-model="selectedTreeFields"
            :options="groupedFiltersArray"
            display="comma"
            :filter="true"
            selectionMode="checkbox"
            placeholder="Фильтры"
            @change="filterByGroup"
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
import { reactive, ref } from 'vue';
import Button from 'primevue/button';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import AutoComplete from 'primevue/autocomplete';
import TreeSelect from 'primevue/treeselect';
import useOptions from '@/composition/selectOptions';

export default {
  name: 'ListLayout',
  components: {
    Button,
    MultiSelect,
    Checkbox,
    Dropdown,
    AutoComplete,
    TreeSelect,
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
    isShowSort: {
      type: Boolean,
      default: true,
    },
    isShowFiltersModeSwitcher: {
      type: Boolean,
      default: false,
    },
    filtersArray: {
      type: Array,
      default: () => [],
    },
    groupedFiltersArray: {
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
    const isOpenSidebar = ref(false);
    const isShowClearFilters = ref(false);
    const isIHave = ref(false);
    const isShowTreeFilters = ref(false);
    const searchString = ref();
    const filteredSuggestions = ref();
    const selectedTreeFields = ref();
    const sortOptions = useOptions([
      { name: 'По цене по возрастанию', code: 'price_asc' },
      { name: 'По цене по убыванию', code: 'price_desc' },
    ]);
    const filtersOptions = reactive({});
    props.filtersArray.forEach((filter) => {
      filtersOptions[filter.field] = useOptions(filter.options);
    });

    const changeIHave = (ihave) => {
      isShowClearFilters.value = true;
      emit('change', ihave);
    };
    const addProduct = () => {
      emit('add');
    };
    const reloadPrices = () => {
      emit('reload');
    };
    const clearFilters = () => {
      emit('clearFilters');
    };
    const sort = (value) => {
      isShowClearFilters.value = true;
      emit('sort', value);
    };
    const filter = (key, value) => {
      isShowClearFilters.value = true;
      emit('filter', {
        key,
        value,
      });
    };
    const filterByGroup = (event) => {
      isShowClearFilters.value = true;
      const keys = Object.keys(event).filter((key) => key.includes('filter'));
      const filters = {};
      keys.forEach((key) => {
        const filterDataArray = key.split('_');
        if (!filters[filterDataArray[1]]) {
          filters[filterDataArray[1]] = [];
        }
        filters[filterDataArray[1]].push(filterDataArray[2]);
      });
      emit('groupedFilter', filters);
    };
    const switchSelectMode = (mode) => {
      isShowTreeFilters.value = mode === 'tree';
      selectedTreeFields.value = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const option in filtersOptions) {
        if ({}.hasOwnProperty.call(filtersOptions, option)) {
          filtersOptions[option].selectedOption = [];
        }
      }
      emit('resetSelects');
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
      isShowClearFilters.value = true;
      emit('search', searchString.value.name);
    };
    const clearEmit = () => {
      emit('clearSearch');
    };
    const toggleSidebar = () => {
      isOpenSidebar.value = !isOpenSidebar.value;
    };
    return {
      searchString,
      isIHave,
      sortOptions,
      filtersOptions,
      changeIHave,
      addProduct,
      reloadPrices,
      sort,
      filter,
      filterByGroup,
      search,
      searchFromSuggestions,
      clearEmit,
      toggleSidebar,
      clearFilters,
      switchSelectMode,
      isShowClearFilters,
      filteredSuggestions,
      isOpenSidebar,
      isShowTreeFilters,
      selectedTreeFields,
    };
  },
};
</script>

<style lang="scss" scoped>
  @import "~@/assets/scss/breakpoints.scss";

  .list-layout {
    padding: 8px;
    margin-top: 10px;
    background-color: var(--surface-b);
    height: 100%;
    &__btn {
      position: fixed;
      left: 0;
      transition: left 0.3s;
      z-index: 1;
      @include all-tablets {
        &--open {
          left: 295px;
        }
      }
    }
    &__sidebar {
      background: var(--surface-b);
      border: 1px solid #ccc;
      position: fixed;
      height: calc(100% - 145px);
      padding: 10px;
      width: 295px;
      overflow-y: auto;
      overflow-x: visible;
      @include all-tablets {
        position: fixed;
        left: -295px;
        transition: left 0.3s;
        z-index: 1;
        &--open {
          left: 0;
          z-index: 1;
        }
      }
    }
    &__content {
      overflow: auto;
      @include all-tablets {
        width: 100%;
        margin-left: 0;
      }
    }
    &__sidebar-top {
      border-bottom: 1px solid #ccc;
    }
    &__sidebar-bottom {
      padding: 10px 0;
    }
  }
</style>
