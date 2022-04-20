<template>
  <defaultPageLayout>
    <template v-slot:page-content>
      <h1>Dishes Pick Product List</h1>
    </template>
  </defaultPageLayout>
</template>

<script>
import defaultPageLayout from '@/layouts/DefaultPageLayout.vue';

export default {
  name: 'dishesPickPoductList',
  components: {
    defaultPageLayout,
  },
};
</script>

<style scoped>

</style>
