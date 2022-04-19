<template>
  <LoginLayout :form-title="formTitle">
    <div class="registration-step-one">
      <span class="p-input-icon-left login-input-wrapper">
          <i class="fas fa-user"></i>
          <InputText
            v-model="userName"
            class="login-input"
            type="text"
            placeholder="Придумайте логин"
          />
      </span>
      <span class="p-input-icon-left login-input-wrapper">
          <i class="fas fa-lock"></i>
          <InputText
            v-model="userPassword"
            class="login-input"
            type="password"
            placeholder="Придумайте пароль"
          />
      </span>
      <span class="p-input-icon-left login-input-wrapper">
          <i class="fas fa-lock"></i>
          <InputText
            v-model="copyPassword"
            class="login-input"
            type="password"
            placeholder="Повторите пароль"
          />
      </span>
      <Button
        class="login-submit-btn"
        :label="formType === 'registration' ? 'Заверширть' : 'Поменять'"
        @click="send"
      />
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
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Cookies from 'js-cookie';
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
    const userName = ref('');
    const userPassword = ref('');
    const copyPassword = ref('');
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
        title = 'Смена учетных данных (шаг2)';
      } else {
        title = 'Регистрация (шаг2)';
      }

      return title;
    });

    onMounted(() => {
      Cookies.set('nutrition_registration_jws', route.params.token, { expires: 1 });
    });

    const send = async () => {
      const data = {
        userName: userName.value,
        userPassword: userPassword.value,
        type: formType.value,
      };
      await store.dispatch('auth/registration', data);
    };

    return {
      send,
      userName,
      userPassword,
      copyPassword,
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
