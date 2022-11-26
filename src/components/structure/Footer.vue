<template>
  <footer class="nutrition-app__footer p-grid p-jc-between">
    <div class="p-col-2 p-as-center">Nutrition manager</div>
    <div class="p-col-1">
      <a href="https://github.com/Bakuard/NutritionManager" class="nutrition-app__footer-link">
        <i class="pi pi-github" style="fontSize: 2rem"></i>
      </a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style lang="scss" scoped>
.nutrition-app {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  &__footer {
    background: var(--surface-b);
    z-index: 2;
    padding: 0 10px;
  }
  &__footer-link {
    color: #000;
    font-size: 3rem;
  }
}
</style>
