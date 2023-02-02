<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div class="product-page">
        <ListLayout
          :filters-array="filters"
          :is-show-check-i-have="true"
          :is-show-reload-prices="false"
          :is-show-filters-mode-switcher="true"
          :grouped-filters-array="groupedFields"
          :key="rerenderKey"
          @change="changeIHave"
          @search="onSearch"
          @add="addProduct"
          @reload="reloadPrices"
          @sort="onSort"
          @filter="onFilter"
          @groupedFilter="onGroupedFilter"
          @clearFilters="onClearFilters"
        >
          <template v-slot:content>
            <div class="product-page__content">
              <div v-if="isProductsListLoaded" class="product-page__grid">
                <div
                  v-for="item in productsList"
                  :key="item.id"
                  class="product-page__item"
                >
                  <NutritionCard
                    :item="item"
                  />
                </div>
              </div>
              <div v-else class="product-page__grid">
                <Skeleton v-for="i in ITEMS_PER_PAGE" :key="i" height="400px"/>
              </div>
              <div class="product-page__paginator-wrapper">
                <Paginator
                  :rows="ITEMS_PER_PAGE"
                  :totalRecords="metadata.totalItems"
                  @page="onPage($event)"
                ></Paginator>
              </div>
            </div>
          </template>
        </ListLayout>
      </div>
    </template>
  </DefaultPageLayout>
</template>

<script>
import {
  computed, reactive, onMounted, nextTick, ref,
} from 'vue';
import { useStore } from 'vuex';
import ListLayout from '@/layouts/ListLayout.vue';
import NutritionCard from '@/components/NutritionCard.vue';
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import { ITEMS_PER_PAGE } from '@/modules/constants';
import Skeleton from 'primevue/skeleton';
import Paginator from 'primevue/paginator';
import { useRouter } from 'vue-router';

export default {
  name: 'productsPage',
  components: {
    ListLayout,
    NutritionCard,
    DefaultPageLayout,
    Skeleton,
    Paginator,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    let params = reactive({
      page: 0,
      size: ITEMS_PER_PAGE,
    });
    const rerenderKey = ref(0);
    const productFields = computed(() => store.state.products.fields);
    const isProductsListLoaded = computed(() => store.state.products.isProductsListLoaded);
    const metadata = computed(() => store.state.products.metadata);
    const groupedFields = computed(() => store.state.products.groupedFields);
    const filters = reactive([
      {
        label: 'Теги',
        options: [],
        field: 'tags',
      },
      {
        label: 'Названия',
        options: [],
        field: 'category',
      },
      {
        label: 'Магазины',
        options: [],
        field: 'shops',
      },
      {
        label: 'Сорта',
        options: [],
        field: 'grades',
      },
      {
        label: 'Производители',
        options: [],
        field: 'manufacturers',
      },
    ]);
    const setFilters = () => {
      const productFieldsKeys = Object.keys(productFields.value);
      productFieldsKeys.forEach((key) => {
        const adaptiveKey = key === 'categories' ? 'category' : key;
        const filter = filters.find((item) => item.field === adaptiveKey);
        if (filter) {
          filter.options = productFields.value[key];
        }
      });
    };

    onMounted(async () => {
      await nextTick();
      await store.dispatch('products/getProductsByFilter', params);
      await store.dispatch('products/getAllProductsFields');
      await store.dispatch('products/getProductsFieldsByCategories');
      setFilters();
    });

    const changeIHave = async (ihave) => {
      params.onlyFridge = ihave;
      await store.dispatch('products/getProductsByFilter', params);
      await store.dispatch('products/getAllProductsFields', params);
    };
    const addProduct = () => {
      router.push('/products/new');
    };
    const reloadPrices = () => {
      console.log('reloadPrices');
    };
    const onSort = async (value) => {
      params.sort = value.code;
      await store.dispatch('products/getProductsByFilter', params);
      await store.dispatch('products/getAllProductsFields', params);
    };
    const onFilter = async (param) => {
      const filtersArray = [];
      param.value.forEach((item) => {
        filtersArray.push(item.name);
      });
      params[param.key] = filtersArray;
      await store.dispatch('products/getProductsByFilter', params);
      await store.dispatch('products/getAllProductsFields', params);
    };
    const onGroupedFilter = async (filters) => {
      params = {
        page: params.page,
        size: params.size,
      };
      console.log('params', params);
      console.log('filters', filters);
      Object.assign(params, filters);
      console.log('filtered', params);
      await store.dispatch('products/getProductsByFilter', params);
      await store.dispatch('products/getAllProductsFields', params);
    };
    const onClearFilters = async () => {
      params = reactive({
        page: 0,
        size: ITEMS_PER_PAGE,
      });
      rerenderKey.value += 1;
      await store.dispatch('products/getProductsByFilter', params);
      await store.dispatch('products/getAllProductsFields', params);
    };
    const onSearch = (value) => {
      console.log('onSearch', value.value);
    };
    const onPage = async (event) => {
      params.page = event.page;
      await store.dispatch('products/getProductsByFilter', params);
    };
    return {
      pageName: computed(() => store.state.products.pageName),
      productsList: computed(() => store.state.products.productsList),
      onPage,
      changeIHave,
      addProduct,
      reloadPrices,
      onSort,
      onFilter,
      onGroupedFilter,
      onSearch,
      onClearFilters,
      rerenderKey,
      params,
      filters,
      isProductsListLoaded,
      metadata,
      groupedFields,
      ITEMS_PER_PAGE,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/list-page.scss";
</style>
