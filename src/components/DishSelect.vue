<template>
  <div class="dish-select">
    <Card class="p-mb-2">
      <template #content>
        <div class="p-grid">
          <div class="p-col-6">
            <div class="p-grid p-fluid">
              <div class="p-col-12">
                <Dropdown
                  :filter="true"
                  optionLabel="name"
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
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

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
};
</script>

<style lang="scss" scoped>

</style>
