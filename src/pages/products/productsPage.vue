<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div class="product-page">
        <ListLayout
          :category-options-array="category"
          :product-tag-options-array="tags"
          :markets-options-array="markets"
          :grades-options-array="grades"
          :manufacturers-options-array="manufacturers"
          :is-show-check-i-have="true"
          :is-show-reload-prices="false"
          @change="changeIHave"
          @search="onSearch"
          @add="addProduct"
          @reload="reloadPrices"
          @sort="onSort"
          @filter="onFilter"
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
  computed, reactive, watch, onMounted,
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
    const params = reactive({
      page: 0,
      size: ITEMS_PER_PAGE,
    });
    const filters = computed(() => store.state.products.filters);
    const category = computed(() => store.state.products.filters.categories);
    const tags = computed(() => store.state.products.filters.tags);
    const markets = computed(() => store.state.products.filters.shops);
    const grades = computed(() => store.state.products.filters.grades);
    const manufacturers = computed(() => store.state.products.filters.manufacturers);
    const user = computed(() => store.state.auth.user);
    const isProductsListLoaded = computed(() => store.state.products.isProductsListLoaded);
    const metadata = computed(() => store.state.products.metadata);

    watch(user, async (currentValue) => {
      if (currentValue !== null) {
        await store.dispatch('products/getAllProductsFields', user.value.id);
      }
    });

    onMounted(async () => {
      if (user.value) {
        await store.dispatch('products/getAllProductsFields', user.value.id);
      }
      await store.dispatch('products/getProductsByFilter', params);
    });

    const changeIHave = async (ihave) => {
      params.onlyFridge = ihave;
      await store.dispatch('products/getProductsByFilter', params);
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
    };
    const onFilter = async (param) => {
      const filtersArray = [];
      param.value.forEach((item) => {
        filtersArray.push(item.name);
      });
      params[param.key] = filtersArray;
      await store.dispatch('products/getProductsByFilter', params);
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
      category,
      tags,
      markets,
      grades,
      manufacturers,
      onPage,
      changeIHave,
      addProduct,
      reloadPrices,
      onSort,
      onFilter,
      onSearch,
      params,
      filters,
      isProductsListLoaded,
      metadata,
      ITEMS_PER_PAGE,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/list-page.scss";
</style>
