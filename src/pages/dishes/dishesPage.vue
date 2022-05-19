<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div class="product-page">
        <ListLayout
          :dishes-tag-options-array="filters.dishTags"
          :is-search-by-name="true"
          :products-options-array="filters.productCategories"
          :is-show-check-i-have="false"
          :is-show-reload-prices="false"
          @search="onSearch"
          @add="addProduct"
          @reload="reloadPrices"
          @sort="onSort"
          @filter="onFilter"
        >
          <template v-slot:content>
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
import { computed, onMounted, reactive } from 'vue';
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
    const filters = computed(() => store.state.dishes.filters);
    const isLoaded = computed(() => store.state.dishes.isDishesListLoaded);
    const params = reactive({
      page: 0,
      size: 200,
    });

    onMounted(async () => {
      await store.dispatch('dishes/getDishesByFilter', params);
      await store.dispatch('dishes/getAllDishesFields');
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
    const onSearch = async (value) => {
      await store.dispatch('dishes/getDishByName', value.value);
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
