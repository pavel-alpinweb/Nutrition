<template>
  <div class="nutrition-app p-d-flex p-flex-column">
    <main class="nutrition-app__content">
      <div class="login-layout">
        <Card class="login-layout__wrapper">
          <template #title>
            {{ $props.formTitle }}
          </template>
          <template #content>
            <slot></slot>
          </template>
        </Card>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Card from 'primevue/card';
import Footer from '@/components/structure/Footer.vue';

export default {
  name: 'LoginLayout',
  props: {
    formTitle: {
      type: String,
      default: '',
    },
  },
  components: {
    Card,
    Footer,
  },
};
</script>

<style scoped lang="scss">
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
  }
}
  .login-layout {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
  }
  .login-layout__wrapper {
    width: 25rem;
    margin: 100px auto 0;
  }
</style>
