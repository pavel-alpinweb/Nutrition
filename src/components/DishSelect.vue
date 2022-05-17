<template>
  <div class="dish-select">
    <Card class="p-mb-2">
      <template #content>
        <div class="p-grid">
          <div class="p-col-6">
            <div class="p-grid p-fluid">
              <div class="p-col-12">
                <Dropdown
                  v-model="dishesOptions.selectedOption.value"
                  :options="dishesOptions.options.value"
                  :filter="true"
                  optionLabel="name"
                  @change="changeHandler($event, item.index)"
                />
              </div>
            </div>
          </div>
          <div class="p-col-6">
            <div class="p-grid p-fluid">
              <div class="p-col-11">
                <InputText
                  class="ingredient__text"
                  type="number"
                  min="1"
                />
              </div>
              <div class="p-col-1">
                <Button
                  icon="fas fa-trash"
                  class="p-button-rounded p-button-danger"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import useOptions from '@/composition/selectOptions';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'DishSelect',
  components: {
    Card,
    Dropdown,
    InputText,
    Button,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const dishNames = computed(() => store.state.menus.filters.dishNames);
    const dishesOptions = useOptions(dishNames);

    const changeHandler = (event, index) => {
      const data = {
        value: event.value,
        index,
      };
      emit('changeOption', data);
    };
    return {
      dishesOptions,
      changeHandler,
    };
  },
};
</script>

<style lang="scss" scoped>

</style>
