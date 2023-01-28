<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div v-if="isProductInit" class="edit-page p-grid">
        <div class="edit-page__left p-xl-6 p-lg-12 p-md-12 p-sm-12 p-col-12">
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
                    :disabled="!product.imageUrl">
                  </Button>
                </div>
              </div>
            </template>
            <template #content>
              <Image
                v-if="product.imageUrl"
                class="edit-page__image"
                :src="product.imageUrl"
                alt="Image"
              />
            </template>
            <template #empty>
              <div v-if="!product.imageUrl" class="edit-page__default-image">
                <i class="pi pi-cloud-upload"></i>
              </div>
            </template>
          </FileUpload>
        </div>
        <div class="edit-page__right p-xl-6 p-lg-12 p-md-12 p-sm-12 p-col-12">
          <div class="p-fluid p-grid">
            <div class="p-field p-col-12 p-xl-6 p-sm-12 p-lg-6">
              <label for="category">Название</label>
              <Dropdown
                v-model="productOptions.categoryOptions.selectedOption.value"
                inputId="category"
                :options="productOptions.categoryOptions.options.value"
                :filter="true"
                optionLabel="name"
                :placeholder="categoryPlaceholder"
                @change="selectField($event, 'category')"
              />
              <Inplace
                class="edit-page__add-category"
                :closable="true"
              >
                <template #display>
                  Добавить новое название
                </template>
                <template #content>
                  <InputText
                    autoFocus
                    v-model="productsNewOptions.category"
                    @keyup.enter="createNewFilter(
                      'category',
                      productOptions.categoryOptions.selectedOption,
                      product,
                    )"
                  />
                </template>
              </Inplace>
            </div>
            <div class="p-field p-col-12 p-xl-6 p-sm-12 p-lg-6">
              <label for="market">Магазин</label>
              <Dropdown
                v-model="productOptions.marketOptions.selectedOption.value"
                inputId="market"
                :options="productOptions.marketOptions.options.value"
                :filter="true"
                optionLabel="name"
                :placeholder="shopsPlaceholder"
                @change="selectField($event, 'shop')"
              />
              <Inplace
                class="edit-page__add-category"
                :closable="true"
              >
                <template #display>
                  Добавить новый магазин
                </template>
                <template #content>
                  <InputText
                    autoFocus
                    v-model="productsNewOptions.shop"
                    @keyup.enter="createNewFilter(
                      'shop',
                      productOptions.marketOptions.selectedOption,
                      product,
                    )"
                  />
                </template>
              </Inplace>
            </div>
            <div class="p-field p-col-12 p-xl-6 p-sm-12 p-lg-6">
              <label for="sort">Сорт</label>
              <Dropdown
                v-model="productOptions.gradeOptions.selectedOption.value"
                inputId="sort"
                :options="productOptions.gradeOptions.options.value"
                :filter="true"
                optionLabel="name"
                :placeholder="gradesPlaceholder"
                @change="selectField($event, 'grade')"
              />
              <Inplace
                class="edit-page__add-category"
                :closable="true"
              >
                <template #display>
                  Добавить новый сорт
                </template>
                <template #content>
                  <InputText
                    autoFocus
                    v-model="productsNewOptions.grade"
                    @keyup.enter="createNewFilter(
                      'grade',
                      productOptions.gradeOptions.selectedOption,
                      product,
                    )"
                  />
                </template>
              </Inplace>
            </div>
            <div class="p-field p-col-12 p-xl-6 p-sm-12 p-lg-6">
              <label for="manufactor">Производитель или марка</label>
              <Dropdown
                v-model="productOptions.manufacturerOptions.selectedOption.value"
                inputId="manufactor"
                :options="productOptions.manufacturerOptions.options.value"
                :filter="true"
                optionLabel="name"
                :placeholder="manufacturersPlaceholder"
                @change="selectField($event, 'manufacturer')"
              />
              <Inplace
                class="edit-page__add-category"
                :closable="true"
              >
                <template #display>
                  Добавить нового производителя
                </template>
                <template #content>
                  <InputText
                    autoFocus
                    v-model="productsNewOptions.manufacturer"
                    @keyup.enter="createNewFilter(
                      'manufacturer',
                      productOptions.manufacturerOptions.selectedOption,
                      product,
                    )"
                  />
                </template>
              </Inplace>
            </div>
            <div class="p-formgrid p-grid p-col-12">
              <div class="p-field p-col-12 p-xl-6">
                <label for="price">Цена за:</label>
                <InputText
                  v-model="product.price"
                  id="price"
                  type="number"
                  placeholder="Цена"
                  min="0"
                />
              </div>
              <div class="p-field p-col-6 p-xl-3">
                <label for="size">Размер упаковки</label>
                <InputText
                  v-model="product.packingSize"
                  id="size"
                  type="number"
                  placeholder="Размер"
                  min="0"
                />
              </div>
              <div class="p-field p-col-6 p-xl-3">
                <label for="options">Единицы</label>
                <Dropdown
                  v-model="unitOptions.selectedOption.value"
                  inputId="options"
                  :options="unitOptions.options.value"
                  optionLabel="name"
                  :placeholder="unitPlaceholder"
                  @change="selectField($event, 'unit')"
                />
              </div>
            </div>
            <div class="p-field p-col-12">
              <label for="iHave">
                У меня в наличии ({{ product.unit }})
              </label>
              <InputText v-model="product.quantity" id="iHave" type="number" min="0"/>
            </div>
            <div class="p-field p-col-12">
              <label for="describe">Примечание</label>
              <Textarea
                id="describe"
                v-model="product.description"
                :autoResize="true"
                rows="5"
                cols="30"
              />
            </div>
          </div>
        </div>
        <div class="edit-page__central p-col-12 p-fluid">
          <div class="p-field">
            <label for="tags">Тэги</label>
            <AutoComplete
              v-model="product.tags"
              placeholder="Добавте тэги для блюда"
              id="tags"
              :suggestions="filteredSuggestions"
              :multiple="true"
              :dropdown="true"
              @complete="searchFromSuggestions"
              @keyup.enter="createNewTag"
            />
          </div>
        </div>
        <div class="p-col-12 edit-page__button-container">
          <Button
            v-if="!isNewProduct"
            label="Новый продукт"
            icon="fas fa-plus-circle"
            class="p-button-success"
            @click="addProduct"
          />
          <Button label="Сохранить" icon="pi pi-save" class="p-button-success" @click="save"/>
          <Button label="Сбросить" icon="pi pi-sync" class="p-button-warning" @click="reset"/>
        </div>
      </div>
      <div v-else class="edit-page">
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
  computed, reactive, onMounted, onBeforeUnmount, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Inplace from 'primevue/inplace';
import Skeleton from 'primevue/skeleton';
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import useOptions from '@/composition/selectOptions';
import useProductOptions from '@/composition/productOptions';
import useCreateNewFilter from '@/composition/createNewFilter';
import { GLOBAL_UNITS, BASE_API_URL } from '@/modules/constants';

export default {
  name: 'productEditPage',
  components: {
    InputText,
    Dropdown,
    FileUpload,
    Image,
    AutoComplete,
    Button,
    Textarea,
    Inplace,
    Skeleton,
    DefaultPageLayout,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const user = computed(() => store.state.auth.user);
    const initialProduct = computed(() => store.state.products.initialProduct);
    const filters = computed(() => store.state.products.fields);
    const product = reactive({});
    const filteredSuggestions = ref();
    const isProductInit = computed(() => Object.keys(product).length > 0);
    const isNewProduct = computed(() => route.params.id === 'new');
    const productOptions = useProductOptions();
    const unitOptions = useOptions(GLOBAL_UNITS);

    const categoryPlaceholder = computed(() => (product.category ? product.category : 'Выберите категорию'));
    const shopsPlaceholder = computed(() => (product.shop ? product.shop : 'Выберите магазин'));
    const gradesPlaceholder = computed(() => (product.grade ? product.grade.toString() : 'Выберите сорт'));
    const manufacturersPlaceholder = computed(() => (product.manufacturer ? product.manufacturer.toString() : 'Выберите производителя'));
    const unitPlaceholder = computed(() => (product.unit ? product.unit : 'Единицы'));

    onMounted(async () => {
      await store.dispatch('products/getAllProductsFields');
      if (!isNewProduct.value) {
        await store.dispatch('products/getProduct', route.params.id);
      }
      Object.assign(product, initialProduct.value);
      store.commit('setBadge', product.category);
    });

    onBeforeUnmount(() => {
      store.commit('setBadge', null);
      store.commit('products/resetInitialProduct');
    });

    const addProduct = () => {
      window.location.replace('/products/new');
    };

    const save = async () => {
      if (isNewProduct.value) {
        await store.dispatch('products/addProduct', product);
      } else {
        await store.dispatch('products/updateProduct', product);
      }
    };

    const myUploader = async (event) => {
      const result = await store.dispatch('products/uploadImage', event.files[0]);
      product.imageUrl = result.body;
    };

    const onClearTemplatingUpload = () => {
      product.imageUrl = null;
    };

    const reset = () => {
      window.location.replace(`/products/${route.params.id}`);
    };

    const selectField = (event, field) => {
      product[field] = event.value.name;
    };

    const searchFromSuggestions = (event) => {
      setTimeout(() => {
        const mapTags = filters.value.tags.map((item) => item.name);
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
        product.tags.push(event.target.value);
      }
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    };

    return {
      ...useCreateNewFilter(),
      myUploader,
      productOptions,
      product,
      isProductInit,
      isNewProduct,
      unitOptions,
      categoryPlaceholder,
      shopsPlaceholder,
      gradesPlaceholder,
      manufacturersPlaceholder,
      unitPlaceholder,
      searchFromSuggestions,
      createNewTag,
      addProduct,
      save,
      reset,
      selectField,
      user,
      initialProduct,
      filteredSuggestions,
      onClearTemplatingUpload,
      BASE_API_URL,
    };
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/edit-page.scss";
</style>
