<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div class="product-page">
        <ListLayout
          :filters-array="filters"
          :is-show-check-i-have="true"
          :is-show-reload-prices="false"
          :key="rerenderKey"
          @change="changeIHave"
          @search="onSearch"
          @add="addProduct"
          @reload="reloadPrices"
          @sort="onSort"
          @filter="onFilter"
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
  computed, reactive, watch, onMounted, ref,
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
    const user = computed(() => store.state.auth.user);
    const isProductsListLoaded = computed(() => store.state.products.isProductsListLoaded);
    const metadata = computed(() => store.state.products.metadata);
    const filters = reactive([
      {
        label: 'Уточнение по тегам',
        options: [],
        field: 'tags',
      },
      {
        label: 'Уточнение по названию',
        options: [],
        field: 'category',
      },
      {
        label: 'Уточнение по магазинам',
        options: [],
        field: 'shops',
      },
      {
        label: 'Уточнение по сортам',
        options: [],
        field: 'grades',
      },
      {
        label: 'Уточнение по производителям',
        options: [],
        field: 'manufacturers',
      },
    ]);

    watch(user, async (currentValue) => {
      if (currentValue !== null) {
        await store.dispatch('products/getAllProductsFields');
        filters[0].options = productFields.value.tags;
        filters[1].options = productFields.value.categories;
        filters[2].options = productFields.value.shops;
        filters[3].options = productFields.value.grades;
        filters[4].options = productFields.value.manufacturers;
      }
    });

    onMounted(async () => {
      await store.dispatch('products/getProductsByFilter', params);
      if (user.value) {
        await store.dispatch('products/getAllProductsFields');
        filters[0].options = productFields.value.tags;
        filters[1].options = productFields.value.categories;
        filters[2].options = productFields.value.shops;
        filters[3].options = productFields.value.grades;
        filters[4].options = productFields.value.manufacturers;
      }
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
    const onClearFilters = async () => {
      params = reactive({
        page: 0,
        size: ITEMS_PER_PAGE,
      });
      rerenderKey.value += 1;
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
      onPage,
      changeIHave,
      addProduct,
      reloadPrices,
      onSort,
      onFilter,
      onSearch,
      onClearFilters,
      rerenderKey,
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
