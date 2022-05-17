<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
      <div class="p-grid">
        <div class="p-col-6">
          <pre>{{ initialMenu }}</pre>
        </div>
        <div class="p-col-6">
          <pre>{{ filters }}</pre>
        </div>
      </div>
      <div class="menu-edit">
        <div class="menu-edit-header p-grid">
          <div class="menu-edit-header__left p-col-6">
            <FileUpload
              name="demo[]"
              url="./upload.php"
              @upload="onUpload"
              :multiple="false"
              accept="image/*"
              :maxFileSize="1000000"
            >
              <template #empty>
                <p>Drag and drop files to here to upload.</p>
              </template>
            </FileUpload>
            <Image
              v-if="image"
              class="menu-edit__image"
              width="250"
              src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
              alt="Image"
            />
            <div v-else class="menu-edit__default-image">
              <i class="fas fa-utensils"></i>
            </div>
          </div>
          <div class="menu-edit-header__right p-col-6 p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-12">
                <label for="name">Название меню</label>
                <InputText
                  v-model="menu.name"
                  id="name"
                  type="text"
                  placeholder="Название меню"
                  min="0"
                />
              </div>
              <div class="p-field p-col-12">
                <label for="describe">Примечание</label>
                <Textarea
                  v-model="menu.description"
                  id="describe"
                  :autoResize="true"
                  rows="5"
                  cols="30"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="menu-edit-content">
          <Panel header="Блюда входящие в меню">
            <template #icons>
              <Button
                label="Добавить"
                icon="fas fa-plus-circle"
                class="p-button-success"
                @click="addDish"
              />
              <Button
                label="Подобрать продукты"
                icon="fas fa-carrot"
                class="p-button-warning"
                @click="pushToPickList()"
              />
            </template>
            <div class="p-grid">
              <div class="p-col-6 p-text-center">
                <h2>Блюдо</h2>
              </div>
              <div class="p-col-6 p-text-center">
                <h2>Количество порций</h2>
              </div>
              <div class="p-col-12">
                <DishSelect
                  v-for="(dish, key) in menu.items"
                  :item="dish"
                  :key="key"
                  @changeOption="changeOptionHandler"
                />
              </div>
            </div>
          </Panel>
        </div>
        <div class="menu-edit-footer">
          <div class="p-fluid p-field">
            <label for="tags">Тэги</label>
            <Chips v-model="menu.tags" id="tags"/>
          </div>
          <div class="menu-edit-footer__buttons">
            <Button
              label="Новое блюдо"
              icon="fas fa-plus-circle"
              class="p-button-success"
            />
            <Button label="Сохранить" icon="pi pi-save" class="p-button-success"/>
            <Button label="Сбросить" icon="pi pi-sync" class="p-button-warning"/>
          </div>
        </div>
      </div>
    </template>
  </DefaultPageLayout>
</template>

<script>
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import DishSelect from '@/components/DishSelect.vue';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Chips from 'primevue/chips';
import Panel from 'primevue/panel';
import useUpload from '@/composition/upload';
import {
  computed, reactive, onMounted, watch,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import DishInMenuTemplate from '@/modules/DishInMenuTemplate';

export default {
  name: 'menuEditPage',
  components: {
    DefaultPageLayout,
    FileUpload,
    InputText,
    Textarea,
    Button,
    Chips,
    Panel,
    DishSelect,
  },
  setup() {
    const image = reactive();
    const store = useStore();
    const router = useRouter();
    const menu = reactive({});
    const initialMenu = computed(() => store.state.menus.initialMenu);
    const filters = computed(() => store.state.menus.filters);
    const user = computed(() => store.state.auth.user);

    watch(user, async (currentValue) => {
      if (currentValue !== null) {
        await store.dispatch('menus/getAllMenusFields', user.value.id);
      }
    });

    onMounted(async () => {
      if (user.value) {
        await store.dispatch('menus/getAllMenusFields', user.value.id);
      }
      Object.assign(menu, initialMenu.value);
    });

    const addDish = () => {
      const index = menu.items.length;
      const dish = new DishInMenuTemplate(index);
      menu.items.push(dish);
    };
    const pushToPickList = () => {
      router.push('/menus-pick-product-list');
    };
    const changeOptionHandler = (data) => {
      const dish = menu.items.find((item) => item.index === data.index);
      dish.dishName = data.value.name;
    };

    return {
      ...useUpload(),
      pushToPickList,
      addDish,
      changeOptionHandler,
      image,
      initialMenu,
      filters,
      menu,
    };
  },
};
</script>

<style lang="scss" scoped>
.menu-edit {
  padding: 10px;
  &-footer {
    padding: 10px;
  }
  .p-button {
    margin-right: .5rem;
  }
  &__default-image {
    font-size: 300px;
    text-align: center;
    margin-top: 20px;
    color: grey;
  }
}
</style>
