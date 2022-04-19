<template>
  <div class="nutrition-app p-d-flex p-flex-column">
    <Header />
    <main class="nutrition-app__content">
      <slot name="page-content"></slot>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/structure/Header.vue';
import Footer from '@/components/structure/Footer.vue';

export default {
  name: 'DefaultPageLayout',
  components: {
    Header,
    Footer,
  },
};
</script>

<style lang="scss" scoped>
.nutrition-app {
  width: 1200px;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  &__content {
    flex-grow: 1;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--surface-b);
  }
}
</style>
