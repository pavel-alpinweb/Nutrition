import { useToast } from 'primevue/usetoast';

export default function useUpload() {
  const toast = useToast();
  const onUpload = () => {
    toast.add({
      severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000,
    });
  };
  return { onUpload };
}
