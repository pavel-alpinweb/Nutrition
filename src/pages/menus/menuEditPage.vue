<template>
  <h1>Edit Page menu</h1>
</template>

<script>
import useSetBage from '@/composition/setBage';

export default {
  name: 'menuEditPage',
  setup() {
    return {
      ...useSetBage('Название меню!'),
    };
  },
};
</script>

<style scoped>

</style>
