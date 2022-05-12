<template>
  <div class="dish-select">
    <Card class="p-mb-2">
      <template #content>
        <div class="p-grid">
          <div class="p-col-6">Блюдо</div>
          <div class="p-col-6">Количество</div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from 'primevue/card';

export default {
  name: 'DishSelect',
  components: {
    Card,
  },
};
</script>

<style lang="scss" scoped>

</style>
