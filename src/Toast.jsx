import { useState } from 'react';

export function useToast() {
  const showToast = (message, type = 'success') => {
    alert(message);
  };
  return { showToast };
}

export default useToast;