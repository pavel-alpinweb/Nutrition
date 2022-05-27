export default function useUpload() {
  const onUpload = (response) => {
    console.log('upload', response);
  };
  return { onUpload };
}
