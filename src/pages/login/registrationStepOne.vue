<template>
  <LoginLayout :form-title="formTitle">
    <div class="registration-step-one">
      <span class="p-input-icon-left login-input-wrapper">
          <i class="fas fa-envelope"></i>
          <InputText
            v-model="email"
            class="login-input"
            type="text"
            placeholder="Введите Ваш Email"
          />
      </span>
      <Button class="login-submit-btn" label="Отправить" @click="send"/>
      <router-link v-if="formType === 'registration'" class="login-link" to="/login">
        Войти
      </router-link>
      <router-link v-if="formType === 'restore'" class="login-link" to="/login">
        Отмена
      </router-link>
    </div>
  </LoginLayout>
</template>

<script>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import LoginLayout from '@/layouts/LoginLayout.vue';

export default {
  name: 'registrationStepOne',
  components: {
    LoginLayout,
    InputText,
    Button,
  },
  setup() {
    const email = ref('');
    const route = useRoute();
    const store = useStore();

    const formType = computed(() => {
      let type = '';
      if (route.path.includes('restore')) {
        type = 'restore';
      } if (route.path.includes('registration')) {
        type = 'registration';
      }

      return type;
    });

    const formTitle = computed(() => {
      let title = '';
      if (formType.value === 'restore') {
        title = 'Смена учетных данных (шаг1)';
      } else {
        title = 'Регистрация (шаг1)';
      }

      return title;
    });

    const send = async () => {
      const data = {
        email: email.value,
        type: formType.value,
      };
      await store.dispatch('auth/verifyEmail', data);
    };

    return {
      send,
      email,
      formType,
      formTitle,
    };
  },
};
</script>

<style lang="scss" scoped>
  .login-input-wrapper {
    margin-bottom: 15px;
    display: block;
  }
  .login-input {
    width: 100%;
  }
  .login-submit-btn {
    width: 100%;
    margin-bottom: 15px;
  }
  .login-link {
    text-decoration: none;
    color: #007AD9;
  }
</style>
