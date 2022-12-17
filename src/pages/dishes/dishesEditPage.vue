<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div v-if="isDishLoaded" class="edit-page">
        <div class="edit-page-header p-grid">
          <div class="edit-page-header__left p-xl-6 p-lg-12 p-md-12 p-sm-12 p-col-12">
            <FileUpload
              class="edit-page__upload"
              name="demo[]"
              :multiple="false"
              accept="image/*"
              :maxFileSize="250000"
              :customUpload="true"
              :auto="true"
              @uploader="myUploader"
            >
              <template #header="{ chooseCallback }">
                <div class="flex flex-wrap justify-content-between align-items-center flex-1">
                  <div class="flex m-2">
                    <Button
                      @click="chooseCallback()"
                      icon="pi pi-images"
                      class="p-button-rounded p-mr-2">
                    </Button>
                    <Button
                      @click="onClearTemplatingUpload"
                      icon="pi pi-times"
                      class="p-button-rounded p-button-danger"
                      :disabled="!dish.imageUrl">
                    </Button>
                  </div>
                </div>
              </template>
              <template #content>
                <Image
                  v-if="dish.imageUrl"
                  class="edit-page__image"
                  :src="dish.imageUrl"
                  alt="Image"
                />
              </template>
              <template #empty>
                <div v-if="!dish.imageUrl" class="edit-page__default-image">
                  <i class="pi pi-cloud-upload"></i>
                </div>
              </template>
            </FileUpload>
          </div>
          <div class="edit-page-header__right  p-xl-6 p-lg-12 p-md-12 p-sm-12 p-col-12 p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-12">
                <label for="name">Название блюда</label>
                <InputText
                  v-model="dish.name"
                  id="name"
                  type="text"
                  placeholder="Название блюда"
                  min="0"
                />
              </div>
              <div class="p-field p-col-5">
                <label for="size">Размер порции</label>
                <InputText
                  v-model="dish.servingSize"
                  id="size"
                  type="number"
                  placeholder="Размер"
                  min="0"
                />
              </div>
              <div class="p-field p-col-7">
                <label for="options">Единицы</label>
                <Dropdown
                  v-model="unitOptions.selectedOption.value"
                  inputId="options"
                  :options="unitOptions.options.value"
                  optionLabel="name"
                  placeholder="Единицы"
                  @change="unitChangeHandler"
                />
              </div>
              <div class="p-field p-col-12">
                <label for="describe">Примечание</label>
                <Textarea
                  v-model="dish.description"
                  id="describe"
                  :autoResize="true"
                  :suggestions="filteredSuggestions"
                  rows="5"
                  cols="30"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="edit-page-content">
          <h2>Ингридиенты входящие в блюдо:</h2>
          <Panel>
            <template #icons>
              <div class="edit-page__button-container">
                <Button
                  label="Добавить"
                  icon="fas fa-plus-circle"
                  class="p-button-success"
                  @click="createIngredient()"
                />
                <Button
                  v-if="!isNewDish"
                  label="Подобрать продукты"
                  icon="fas fa-carrot"
                  class="p-button-warning"
                  @click="pushToPickList()"
                />
              </div>
            </template>
            <div class="p-grid all-mobiles-hide laptops-hide all-tablets-hide">
              <div class="p-col-8 p-text-center">
                <h3>Ингридиент</h3>
              </div>
              <div class="p-col-4 p-text-center">
                <h3>Количество</h3>
              </div>
            </div>
            <Ingredient
              v-for="item in dish.ingredients"
              :key="item.id"
              :item="item"
              @deleteIngredient="deleteIngredientHandler"
              @inputServingSize="inputServingSizeHandler"
              @changeOption="changeOptionHandler"
            />
          </Panel>
        </div>
        <div class="edit-page-footer">
          <div class="p-fluid p-field">
            <label for="tags">Тэги</label>
            <AutoComplete
              v-model="dish.tags"
              placeholder="Добавте тэги для блюда"
              id="tags"
              :suggestions="filteredSuggestions"
              :multiple="true"
              :dropdown="true"
              @complete="searchFromSuggestions"
              @keyup.enter="createNewTag"
            />
          </div>
          <div class="edit-page-footer__buttons edit-page__button-container">
            <Button
              v-if="!isNewDish"
              label="Новое блюдо"
              icon="fas fa-plus-circle"
              class="p-button-success"
              @click="addDish"
            />
            <Button label="Сохранить" icon="pi pi-save" class="p-button-success" @click="save"/>
            <Button label="Сбросить" icon="pi pi-sync" class="p-button-warning" @click="reset"/>
          </div>
        </div>
      </div>
      <div v-else class="product-edit">
        <div class="edit-page__skeleton-grid">
          <Skeleton class="edit-page__item edit-page__item--image" height="25vh"/>
          <Skeleton class="edit-page__item edit-page__item--input-1" height="30px"/>
          <Skeleton class="edit-page__item edit-page__item--input-2" height="30px"/>
          <Skeleton class="edit-page__item edit-page__item--input-3" height="30px"/>
          <Skeleton class="edit-page__item edit-page__item--input-4" height="30px"/>
          <Skeleton class="edit-page__item edit-page__item--input-5" height="30px"/>
        </div>
      </div>
    </template>
  </DefaultPageLayout>
</template>

<script>
import { useStore } from 'vuex';
import {
  computed, reactive, onMounted, ref, onBeforeUnmount,
} from 'vue';
import useUpload from '@/composition/upload';
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import Panel from 'primevue/panel';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Skeleton from 'primevue/skeleton';
import Image from 'primevue/image';
import AutoComplete from 'primevue/autocomplete';
import useOptions from '@/composition/selectOptions';
import Ingredient from '@/components/Ingredient.vue';
import { GLOBAL_UNITS } from '@/modules/constants';
import IngredientTemplate from '@/modules/classes';
import { useRoute, useRouter } from 'vue-router';
import useSetSelect from '@/composition/setSelect';

export default {
  name: 'dishesEditPage',
  components: {
    DefaultPageLayout,
    Panel,
    AutoComplete,
    Button,
    FileUpload,
    InputText,
    Dropdown,
    Textarea,
    Ingredient,
    Skeleton,
    Image,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const dish = reactive({});
    const filteredSuggestions = ref();
    const ingredientsArr = ref([]);
    const initialDish = computed(() => store.state.dishes.initialDish);
    const isDishLoaded = computed(() => store.state.dishes.isDishLoaded);
    const filters = computed(() => store.state.dishes.fields);
    const isNewDish = computed(() => route.params.id === 'new');
    const unitOptions = useOptions(GLOBAL_UNITS);

    onMounted(async () => {
      if (!isNewDish.value) {
        await store.dispatch('dishes/getDishById', route.params.id);
      }
      await store.dispatch('dishes/getAllDishesFields');
      await store.dispatch('products/getAllProductsFields');
      useSetSelect(unitOptions, initialDish, 'unit');

      ingredientsArr.value = initialDish.value.ingredients;
      Object.assign(dish, initialDish.value);
      store.commit('setBadge', dish.name);
    });

    onBeforeUnmount(() => {
      store.commit('setBadge', null);
      store.commit('dishes/resetInitialDish');
    });

    const reset = () => {
      window.location.replace(`/dishes/${route.params.id}`);
    };

    const deleteIngredientHandler = (index) => {
      dish.ingredients = dish.ingredients.filter(
        (ing) => ing.index !== index,
      );
    };

    const inputServingSizeHandler = (data) => {
      const ingredient = dish.ingredients.find((ing) => ing.index === data.index);
      ingredient.quantity = data.quantity;
    };

    const createIngredient = () => {
      const index = dish.ingredients.length;
      const ingrid = new IngredientTemplate(index);
      ingredientsArr.value.push(ingrid);
      dish.ingredients = ingredientsArr;
    };

    const changeOptionHandler = (data) => {
      const ingredient = dish.ingredients.find((ing) => ing.index === data.index);
      if (data.field === 'category') {
        ingredient.filter.category = data.value;
      } else {
        const optionArr = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const option of data.value) {
          optionArr.push(option.name);
        }
        ingredient.filter[data.field] = optionArr;
      }
    };

    const searchFromSuggestions = (event) => {
      setTimeout(() => {
        const mapTags = filters.value.dishTags.map((item) => item.name);
        if (!event.query.trim().length) {
          filteredSuggestions.value = [...mapTags];
        } else {
          filteredSuggestions.value = mapTags
            .filter((item) => item.toLowerCase().startsWith(event.query.toLowerCase()));
        }
      }, 250);
    };

    const createNewTag = (event) => {
      if (event.target.value.trim().length) {
        dish.tags.push(event.target.value);
      }
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    };

    const unitChangeHandler = (event) => {
      dish.unit = event.value.name;
    };

    const addDish = () => {
      window.location.replace('/dishes/new');
    };

    const pushToPickList = () => {
      router.push(`/dishes-pick-product-list/${route.params.id}`);
    };

    const myUploader = async (event) => {
      const result = await store.dispatch('dishes/uploadImage', event.files[0]);
      dish.imageUrl = result.body;
    };

    const onClearTemplatingUpload = () => {
      dish.imageUrl = null;
    };

    const save = async () => {
      if (isNewDish.value) {
        await store.dispatch('dishes/dishAdd', dish);
      } else {
        await store.dispatch('dishes/updateDish', dish);
      }
    };

    return {
      ...useUpload(),
      unitOptions,
      initialDish,
      isNewDish,
      dish,
      isDishLoaded,
      myUploader,
      reset,
      save,
      addDish,
      createIngredient,
      deleteIngredientHandler,
      inputServingSizeHandler,
      changeOptionHandler,
      unitChangeHandler,
      pushToPickList,
      searchFromSuggestions,
      createNewTag,
      onClearTemplatingUpload,
      filteredSuggestions,
      ingredientsArr,
    };
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/breakpoints.scss";
@import "~@/assets/scss/edit-page.scss";
</style>
