<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div v-if="isProductInit" class="product-edit p-grid">
        <div class="product-edit__left p-col-6">
          <Image
            v-if="product.imageUrl"
            class="product-edit__image"
            :src="product.imageUrl"
            alt="Image"
          />
          <div v-else class="product-edit__default-image">
            <i class="fas fa-carrot"></i>
          </div>
          <FileUpload
            class="product-edit__upload"
            name="demo[]"
            :multiple="false"
            accept="image/*"
            :maxFileSize="1000000"
            :customUpload="true"
            @uploader="myUploader"
            @upload="onUpload"
          >
            <template #empty>
              <p>Перетащите файл сюда для загрузки</p>
            </template>
          </FileUpload>
        </div>
        <div class="product-edit__right p-col-6">
          <div class="p-fluid p-grid">
            <div class="p-field p-col-6">
              <label for="category">Категория</label>
              <Dropdown
                v-model="productOptions.categoryOptions.selectedOption.value"
                inputId="category"
                :options="productOptions.categoryOptions.options.value"
                :filter="true"
                optionLabel="name"
                placeholder="Категория"
              />
              <Inplace
                class="product-edit__add-category"
                :closable="true"
              >
                <template #display>
                  Добавить новую категорию
                </template>
                <template #content>
                  <InputText
                    autoFocus
                    v-model="productsNewOptions.category"
                    @keyup.enter="createNewFilter(
                      'category',
                      productOptions.categoryOptions.selectedOption
                    )"
                  />
                </template>
              </Inplace>
            </div>
            <div class="p-field p-col-6">
              <label for="market">Магазин</label>
              <Dropdown
                v-model="productOptions.marketOptions.selectedOption.value"
                inputId="market"
                :options="productOptions.marketOptions.options.value"
                :filter="true"
                optionLabel="name"
                placeholder="Магазин"
              />
              <Inplace
                class="product-edit__add-category"
                :closable="true"
              >
                <template #display>
                  Добавить новый магазин
                </template>
                <template #content>
                  <InputText
                    autoFocus
                    v-model="productsNewOptions.market"
                    @keyup.enter="createNewFilter(
                      'market',
                      productOptions.marketOptions.selectedOption
                    )"
                  />
                </template>
              </Inplace>
            </div>
            <div class="p-field p-col-6">
              <label for="sort">Сорт</label>
              <Dropdown
                v-model="productOptions.gradeOptions.selectedOption.value"
                inputId="sort"
                :options="productOptions.gradeOptions.options.value"
                :filter="true"
                optionLabel="name"
                placeholder="Сорт"
              />
              <Inplace
                class="product-edit__add-category"
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
                      productOptions.gradeOptions.selectedOption
                    )"
                  />
                </template>
              </Inplace>
            </div>
            <div class="p-field p-col-6">
              <label for="manufactor">Производитель</label>
              <Dropdown
                v-model="productOptions.manufacturerOptions.selectedOption.value"
                inputId="manufactor"
                :options="productOptions.manufacturerOptions.options.value"
                :filter="true"
                optionLabel="name"
                placeholder="Производитель"
              />
              <Inplace
                class="product-edit__add-category"
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
                      productOptions.manufacturerOptions.selectedOption
                    )"
                  />
                </template>
              </Inplace>
            </div>
            <div class="p-formgrid p-grid p-col-12">
              <div class="p-field p-col-6">
                <label for="price">Цена за:</label>
                <InputText
                  v-model="product.price"
                  id="price"
                  type="number"
                  placeholder="Цена"
                  min="0"
                />
              </div>
              <div class="p-field p-col-3">
                <label for="size">Размер упаковки</label>
                <InputText
                  v-model="product.packingSize"
                  id="size"
                  type="number"
                  placeholder="Размер"
                  min="0"
                />
              </div>
              <div class="p-field p-col-3">
                <label for="options">Единицы</label>
                <Dropdown
                  v-model="unitOptions.selectedOption.value"
                  inputId="options"
                  :options="unitOptions.options.value"
                  optionLabel="name"
                  placeholder="Единицы"
                />
              </div>
            </div>
            <div class="p-field  p-col-12">
              <label for="iHave">У меня в наличии</label>
              <InputText v-model="product.quantity" id="iHave" type="number" min="0"/>
            </div>
            <div class="p-field  p-col-12">
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
        <div class="product-edit__central p-col-12 p-fluid">
          <div class="p-field">
            <label for="tags">Тэги</label>
            <Chips id="tags" v-model="product.tags"/>
          </div>
        </div>
        <div class="p-col-12">
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
      <div v-else class="product-edit">
        <div class="product-edit__skeleton-grid">
          <Skeleton class="product-edit__item product-edit__item--image" height="25vh"/>
          <Skeleton class="product-edit__item product-edit__item--input-1" height="30px"/>
          <Skeleton class="product-edit__item product-edit__item--input-2" height="30px"/>
          <Skeleton class="product-edit__item product-edit__item--input-3" height="30px"/>
          <Skeleton class="product-edit__item product-edit__item--input-4" height="30px"/>
          <Skeleton class="product-edit__item product-edit__item--input-5" height="30px"/>
        </div>
      </div>
    </template>
  </DefaultPageLayout>
</template>

<script>
import { useStore } from 'vuex';
import {
  computed, reactive, onMounted, watch, onBeforeUnmount,
} from 'vue';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import FileUpload from 'primevue/fileupload';
import Image from 'primevue/image';
import Chips from 'primevue/chips';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Inplace from 'primevue/inplace';
import Skeleton from 'primevue/skeleton';
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import useOptions from '@/composition/selectOptions';
import useProductOptions from '@/composition/productOptions';
import useCreateNewFilter from '@/composition/createNewFilter';
import useSetSelect from '@/composition/setSelect';
import { GLOBAL_UNITS, BASE_API_URL } from '@/modules/constants';

export default {
  name: 'productEditPage',
  components: {
    InputText,
    Dropdown,
    FileUpload,
    Image,
    Chips,
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
    const product = reactive({});
    const isProductInit = computed(() => Object.keys(product).length > 0);
    const isNewProduct = computed(() => route.params.id === 'new');
    const productOptions = useProductOptions();
    const unitOptions = useOptions(GLOBAL_UNITS);
    const setProductOptions = () => {
      useSetSelect(productOptions.categoryOptions, initialProduct, 'category');
      useSetSelect(productOptions.manufacturerOptions, initialProduct, 'manufacturer');
      useSetSelect(productOptions.gradeOptions, initialProduct, 'grade');
      useSetSelect(productOptions.marketOptions, initialProduct, 'shop');
      useSetSelect(unitOptions, initialProduct, 'unit');
    };

    watch(user, async (currentValue) => {
      if (currentValue !== null) {
        await store.dispatch('products/getAllProductsFields', user.value.id);
        setProductOptions();
      }
    });

    onMounted(async () => {
      if (user.value) {
        await store.dispatch('products/getAllProductsFields', user.value.id);
      }
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
      product.category = productOptions.categoryOptions.selectedOption?.value
        ? productOptions.categoryOptions.selectedOption.value.name : null;

      product.manufacturer = productOptions.manufacturerOptions.selectedOption?.value
        ? productOptions.manufacturerOptions.selectedOption.value.name : null;

      product.grade = productOptions.gradeOptions.selectedOption?.value
        ? productOptions.gradeOptions.selectedOption.value.name : null;

      product.shop = productOptions.marketOptions.selectedOption?.value
        ? productOptions.marketOptions.selectedOption.value.name : null;

      product.unit = unitOptions.selectedOption?.value
        ? unitOptions.selectedOption.value.name : null;

      product.userId = user.value.id;

      if (isNewProduct.value) {
        await store.dispatch('products/addProduct', product);
      } else {
        console.log('save', product);
        await store.dispatch('products/updateProduct', product);
      }
    };

    const onUpload = (response) => {
      console.log('upload', response);
    };

    const myUploader = async (event) => {
      console.log('myUploader', event.files[0]);
      const result = await store.dispatch('products/uploadImage', event.files[0]);
      console.log('result', result);
      product.imageUrl = result.body;
    };

    const reset = () => {
      Object.assign(product, initialProduct.value);
      setProductOptions();
    };

    return {
      ...useCreateNewFilter(),
      onUpload,
      myUploader,
      productOptions,
      product,
      isProductInit,
      isNewProduct,
      unitOptions,
      addProduct,
      save,
      reset,
      user,
      initialProduct,
      BASE_API_URL,
    };
  },
};
</script>

<style lang="scss" scoped>
  .product-edit {
    padding: 10px;
    &__image {
      display: block;
      margin: 0 auto;
      text-align: center;
      overflow: hidden;
    }
    &__default-image {
      font-size: 300px;
      text-align: center;
      margin-top: 20px;
      color: grey;
    }
    &__add-category {
      margin-top: 10px;
    }
    &__skeleton-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: 30px;
      grid-template-areas:
        "image image input-1 input-2"
        "image image input-3 input-4"
        "input-5 input-5 input-5 input-5";
      grid-gap: 10px;
    }
    &__item {
      &--image {
        grid-area: image;
      }
      &--input-1 {
        grid-area: input-1;
      }
      &--input-2 {
        grid-area: input-2;
      }
      &--input-3 {
        grid-area: input-3;
      }
      &--input-4 {
        grid-area: input-4;
      }
      &--input-5 {
        grid-area: input-5;
      }
    }
  }
  .p-button {
    margin-right: .5rem;
  }
</style>
<style lang="scss">
.product-edit__image {
  img {
    height: 446px;
    width: auto;
  }
}
</style>
