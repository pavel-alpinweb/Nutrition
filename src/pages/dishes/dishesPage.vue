<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div class="product-page">
        <ListLayout
          :filters-array="filters"
          :is-search-by-name="true"
          :is-show-check-i-have="false"
          :is-show-reload-prices="false"
          :is-show-sort="false"
          :searchArray="filters.dishNames"
          :key="rerenderKey"
          search-placeholder="Название блюда"
          @search="onSearch"
          @add="addProduct"
          @reload="reloadPrices"
          @sort="onSort"
          @filter="onFilter"
          @clearSearch="onClearSearch"
          @clearFilters="onClearFilters"
        >
          <template v-slot:content>
            <div class="product-page__content">
              <div v-if="isLoaded" class="product-page__grid">
                <div
                  v-for="item in dishesList"
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
  computed, onMounted, reactive, ref,
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
    const dishesFields = computed(() => store.state.dishes.fields);
    const isLoaded = computed(() => store.state.dishes.isDishesListLoaded);
    const metadata = computed(() => store.state.dishes.metadata);
    const filters = reactive([
      {
        label: 'Теги',
        options: [],
        field: 'tags',
      },
      {
        label: 'Продукты',
        options: [],
        field: 'productCategories',
      },
    ]);
    let params = reactive({
      page: 0,
      size: ITEMS_PER_PAGE,
    });
    const rerenderKey = ref(0);

    onMounted(async () => {
      await store.dispatch('dishes/getDishesByFilter', params);
      await store.dispatch('dishes/getAllDishesFields');
      filters[0].options = dishesFields.value.dishTags;
      filters[1].options = dishesFields.value.productCategories;
    });

    const addProduct = () => {
      router.push('/dishes/new');
    };
    const reloadPrices = () => {
      console.log('reloadPrices');
    };
    const onSort = async (value) => {
      params.sort = value.code;
      await store.dispatch('dishes/getDishesByFilter', params);
    };
    const onFilter = async (param) => {
      const filtersArray = [];
      param.value.forEach((item) => {
        filtersArray.push(item.name);
      });
      params[param.key] = filtersArray;
      await store.dispatch('dishes/getDishesByFilter', params);
    };
    const onClearFilters = async () => {
      params = reactive({
        page: 0,
        size: ITEMS_PER_PAGE,
      });
      rerenderKey.value += 1;
      await store.dispatch('dishes/getDishesByFilter', params);
    };
    const onSearch = async (value) => {
      await store.dispatch('dishes/getDishByName', value);
    };
    const onPage = async (event) => {
      params.page = event.page;
      await store.dispatch('dishes/getDishesByFilter', params);
    };
    const onClearSearch = async () => {
      await store.dispatch('dishes/getDishesByFilter', params);
    };
    return {
      pageName: computed(() => store.state.dishes.pageName),
      dishesList: computed(() => store.state.dishes.dishesList),
      filters,
      params,
      isLoaded,
      addProduct,
      reloadPrices,
      onSort,
      onFilter,
      onSearch,
      onClearSearch,
      onPage,
      onClearFilters,
      ITEMS_PER_PAGE,
      metadata,
      rerenderKey,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/list-page.scss";
</style>
