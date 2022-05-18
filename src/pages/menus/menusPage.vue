<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div class="product-page">
        <ListLayout
          :menus-tag-options-array="filters.menuTags"
          :dishes-options-array="filters.dishNames"
          :is-search-by-name="true"
          :is-show-reload-prices="true"
          @change="changeIHave"
          @search="onSearch"
          @add="addProduct"
          @reload="reloadPrices"
          @sort="onSort"
          @filter="onFilter"
        >
          <template v-slot:content>
            <div v-if="isLoaded" class="product-page__grid">
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
import { computed, reactive, onMounted } from 'vue';
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
    const filters = computed(() => store.state.menus.filters);
    const isLoaded = computed(() => store.state.menus.isMenusListLoaded);
    const params = reactive({
      page: 0,
      size: 200,
    });

    onMounted(async () => {
      await store.dispatch('menus/getMenusByFilter', params);
      await store.dispatch('menus/getAllMenusFields');
    });

    const changeIHave = (ihave) => {
      console.log('change', ihave);
    };
    const addProduct = () => {
      router.push('/menu/new');
    };
    const reloadPrices = () => {
      console.log('reloadPrices');
    };
    const onSort = async (value) => {
      params.sort = value.code;
      await store.dispatch('menus/getMenusByFilter', params);
    };
    const onFilter = async (param) => {
      const filtersArray = [];
      param.value.forEach((item) => {
        filtersArray.push(item.name);
      });
      params[param.key] = filtersArray;
      await store.dispatch('menus/getMenusByFilter', params);
    };
    const onSearch = async (value) => {
      console.log('onSearch', value.value);
      await store.dispatch('menus/getMenuByName', value.value);
    };
    return {
      pageName: computed(() => store.state.menus.pageName),
      productsList: computed(() => store.state.menus.menuslist),
      params,
      filters,
      isLoaded,
      changeIHave,
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
