export function useConfirm() {
  const confirm = async ({ message }) => {
    return window.confirm(message);
  };
  return { confirm };
}

export default useConfirm;