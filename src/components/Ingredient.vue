<template>
  <div class="ingredient p-grid">
    <div class="p-col-12 p-lg-8 ingredient__filters">
      <Card>
        <template #content>
          <div class="grid p-fluid">
            <div class="p-mb-2 col-12 md:col-4">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="fas fa-tag"></i>
                </span>
                <Dropdown
                  v-model="productOptions.categoryOptions.selectedOption.value"
                  inputId="category"
                  :options="productOptions.categoryOptions.options.value"
                  :filter="true"
                  optionLabel="name"
                  :placeholder="categoryPlaceholder"
                  @change="changeHandler($event, item.index, 'category')"
                />
              </div>
            </div>
            <div class="p-mb-2 col-12 md:col-4">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="fas fa-store"></i>
                </span>
                <MultiSelect
                  v-model="productOptions.marketOptions.selectedOption.value"
                  inputId="market"
                  :options="productOptions.marketOptions.options.value"
                  :filter="true"
                  optionLabel="name"
                  :placeholder="shopsPlaceholder"
                  @change="changeHandler($event, item.index, 'shops')"
                />
              </div>
            </div>
            <div class="p-mb-2 col-12 md:col-4">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="fas fa-certificate"></i>
                </span>
                <MultiSelect
                  v-model="productOptions.gradeOptions.selectedOption.value"
                  inputId="sort"
                  :options="productOptions.gradeOptions.options.value"
                  :filter="true"
                  optionLabel="name"
                  :placeholder="gradesPlaceholder"
                  @change="changeHandler($event, item.index, 'grades')"
                />
              </div>
            </div>
            <div class="p-mb-2 col-12 md:col-4">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="fa fa-industry"></i>
                </span>
                <MultiSelect
                  v-model="productOptions.manufacturerOptions.selectedOption.value"
                  inputId="manufactor"
                  :options="productOptions.manufacturerOptions.options.value"
                  :filter="true"
                  optionLabel="name"
                  :placeholder="manufacturersPlaceholder"
                  @change="changeHandler($event, item.index, 'manufacturers')"
                />
              </div>
            </div>
            <div class="p-mb-2 col-12 md:col-4">
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                    <i class="fas fa-tag"></i>
                </span>
                <MultiSelect
                  v-model="productOptions.tagsOptions.selectedOption.value"
                  inputId="tags"
                  :options="productOptions.tagsOptions.options.value"
                  :filter="true"
                  optionLabel="name"
                  :placeholder="tagsPlaceholder"
                  @change="changeHandler($event, item.index, 'tags')"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="p-col-12 p-lg-4 ingredient__number">
      <InputText
        v-model="quantity"
        class="ingredient__text"
        type="number" min="0"
        @input="inputServingSize"
      />
      <Button
        icon="fas fa-trash"
        class="p-button-rounded p-button-danger"
        @click="deleteIngredient()"
      />
    </div>
  </div>
</template>

<script>
import {
  ref, computed,
} from 'vue';
import useProductOptions from '@/composition/productOptions';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';

export default {
  name: 'ingredient',
  components: {
    Card,
    InputText,
    Button,
    Dropdown,
    MultiSelect,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const productOptions = useProductOptions();
    const quantity = ref(props.item.quantity);
    const categoryPlaceholder = computed(() => (props.item.filter.category ? props.item.filter.category : 'Выберите категорию'));
    const shopsPlaceholder = computed(() => (props.item.filter.shops?.length ? props.item.filter.shops.toString() : 'Любой магазин'));
    const gradesPlaceholder = computed(() => (props.item.filter.grades?.length ? props.item.filter.grades.toString() : 'Любой сорт'));
    const manufacturersPlaceholder = computed(() => (props.item.filter.manufacturers?.length ? props.item.filter.manufacturers.toString() : 'Любой производитель'));
    const tagsPlaceholder = computed(() => (props.item.filter.tags?.length ? props.item.filter.tags.toString() : 'Любые тэги'));

    const deleteIngredient = () => {
      emit('deleteIngredient', props.item.index);
    };
    const inputServingSize = () => {
      emit('inputServingSize', { index: props.item.index, quantity: quantity.value });
    };

    const changeHandler = (event, index, field) => {
      const data = {
        value: field === 'category' ? event.value.name : event.value,
        index,
        field,
      };
      emit('changeOption', data);
    };
    return {
      productOptions,
      deleteIngredient,
      inputServingSize,
      quantity,
      changeHandler,
      categoryPlaceholder,
      shopsPlaceholder,
      gradesPlaceholder,
      manufacturersPlaceholder,
      tagsPlaceholder,
    };
  },
};
</script>

<style lang="scss" scoped>
  .ingredient {
    &__text {
      margin-right: 15px;
    }
    &__number {
      padding-top: 40px;
    }
  }
</style>
