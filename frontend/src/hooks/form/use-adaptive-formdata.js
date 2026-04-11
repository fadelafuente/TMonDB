import { useEffect } from "react";
import { useFormData } from "./use-form-data";

export function useAdaptiveFormData(initialForm) {
  const [formData, setFormData, setInitialData] = useFormData(initialForm);

  useEffect(() => {
    const textarea = document.getElementById('auto-resizing');

    if(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [formData]);

  return [formData, setFormData, setInitialData];
}