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
          :is-show-reload-prices="true"
          @change="changeIHave"
          @search="onSearch"
          @add="addProduct"
          @reload="reloadPrices"
          @sort="onSort"
          @filter="onFilter"
        >
          <template v-slot:content>
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
              <Skeleton height="400px"/>
              <Skeleton height="400px"/>
              <Skeleton height="400px"/>
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
import Skeleton from 'primevue/skeleton';
import { useRouter } from 'vue-router';

export default {
  name: 'productsPage',
  components: {
    ListLayout,
    NutritionCard,
    DefaultPageLayout,
    Skeleton,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const params = reactive({
      page: 0,
      size: 200,
    });
    const filters = computed(() => store.state.products.filters);
    const category = computed(() => store.state.products.filters.categories);
    const tags = computed(() => store.state.products.filters.tags);
    const markets = computed(() => store.state.products.filters.shops);
    const grades = computed(() => store.state.products.filters.grades);
    const manufacturers = computed(() => store.state.products.filters.manufacturers);
    const user = computed(() => store.state.auth.user);
    const isProductsListLoaded = computed(() => store.state.products.isProductsListLoaded);

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
    return {
      pageName: computed(() => store.state.products.pageName),
      productsList: computed(() => store.state.products.productsList),
      category,
      tags,
      markets,
      grades,
      manufacturers,
      changeIHave,
      addProduct,
      reloadPrices,
      onSort,
      onFilter,
      onSearch,
      params,
      filters,
      isProductsListLoaded,
    };
  },
};
</script>

<style lang="scss" scoped>
  .product-page {
    height: 100%;
    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 0.5rem;
    }
  }
</style>
