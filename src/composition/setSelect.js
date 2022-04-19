export default function useSetSelect(selectOptions, dataObject, key) {
  const selectedParameter = selectOptions.options.value.find(
    (item) => item.name === dataObject.value[key],
  );
  // eslint-disable-next-line
  selectOptions.selectedOption.value = selectedParameter;
}
