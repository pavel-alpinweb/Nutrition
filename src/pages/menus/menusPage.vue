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
            <div class="p-grid">
              <div class="p-col-6">{{ params }}</div>
              <div class="p-col-6">{{ filters }}</div>
            </div>
            <div class="product-page__grid">
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
          </template>
        </ListLayout>
      </div>
    </template>
  </DefaultPageLayout>
</template>

<script>
import { computed, reactive } from 'vue';
import { useStore } from 'vuex';
import ListLayout from '@/layouts/ListLayout.vue';
import NutritionCard from '@/components/NutritionCard.vue';
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'productsPage',
  components: {
    ListLayout,
    NutritionCard,
    DefaultPageLayout,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const filters = computed(() => store.state.menus.filters);
    const params = reactive({
      page: 0,
      size: 200,
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
    const onSort = (value) => {
      console.log('onSort', value);
    };
    const onFilter = (value) => {
      console.log('onFilter', value);
    };
    const onSearch = (value) => {
      console.log('onSearch', value.value);
    };
    return {
      pageName: computed(() => store.state.menus.pageName),
      productsList: computed(() => store.state.menus.menuslist),
      params,
      filters,
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
