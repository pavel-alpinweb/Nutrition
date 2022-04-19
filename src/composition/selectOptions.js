import { ref } from 'vue';

export default function useOptions(optionsParam) {
  const selectedOption = ref(null);
  const options = ref(optionsParam);

  return {
    selectedOption,
    options,
  };
}
