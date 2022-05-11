<template>
  <DefaultPageLayout>
    <template v-slot:page-content>
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
              <i class="fas fa-concierge-bell"></i>
            </div>
          </div>
          <div class="menu-edit-header__right p-col-6 p-formgrid">
            <div class="p-fluid p-grid">
              <div class="p-field p-col-12">
                <label for="name">Название меню</label>
                <InputText
                  id="name"
                  type="text"
                  placeholder="Название меню"
                  min="0"
                />
              </div>
              <div class="p-field p-col-12">
                <label for="describe">Примечание</label>
                <Textarea
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
          <h1>Dishes list</h1>
        </div>
        <div class="menu-edit-footer">
          <h1>Footer</h1>
        </div>
      </div>
    </template>
  </DefaultPageLayout>
</template>

<script>
import DefaultPageLayout from '@/layouts/DefaultPageLayout.vue';
import FileUpload from 'primevue/fileupload';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import useUpload from '@/composition/upload';
import { reactive } from 'vue';

export default {
  name: 'menuEditPage',
  components: {
    DefaultPageLayout,
    FileUpload,
    InputText,
    Textarea,
  },
  setup() {
    const image = reactive();
    return {
      ...useUpload(),
      image,
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
