<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div class="product-page">
        <ListLayout
          :menus-tag-options-array="filters.menuTags"
          :dishes-options-array="filters.dishNames"
          :is-search-by-name="true"
          :is-show-reload-prices="false"
          :searchArray="filters.menuNames"
          search-placeholder="Название меню"
          @change="changeIHave"
          @search="onSearch"
          @add="addProduct"
          @reload="reloadPrices"
          @sort="onSort"
          @filter="onFilter"
          @clearSearch="onClearSearch"
        >
          <template v-slot:content>
            <div class="product-page__content">
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
import { computed, reactive, onMounted } from 'vue';
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
    const filters = computed(() => store.state.menus.filters);
    const isLoaded = computed(() => store.state.menus.isMenusListLoaded);
    const metadata = computed(() => store.state.menus.metadata);
    const params = reactive({
      page: 0,
      size: ITEMS_PER_PAGE,
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
      await store.dispatch('menus/getMenuByName', value);
    };
    const onPage = async (event) => {
      params.page = event.page;
      await store.dispatch('menus/getMenusByFilter', params);
    };
    const onClearSearch = async () => {
      await store.dispatch('menus/getMenusByFilter', params);
    };
    return {
      pageName: computed(() => store.state.menus.pageName),
      productsList: computed(() => store.state.menus.menuslist),
      params,
      filters,
      isLoaded,
      metadata,
      changeIHave,
      addProduct,
      reloadPrices,
      onSort,
      onFilter,
      onSearch,
      onClearSearch,
      onPage,
      ITEMS_PER_PAGE,
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
  &__paginator-wrapper {
    margin-top: auto;
    .p-paginator {
      border: none;
    }
  }
  &__content {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
