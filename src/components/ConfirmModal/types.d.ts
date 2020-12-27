type ConfirmModalCallback = ({
  setLoading,
  closeModal,
  setError,
}: {
  setLoading: (value: boolean) => void;
  closeModal: () => void;
  setError: (err: string | null) => void;
}) => void;

declare type ConfirmModalOptions = {
  callback?: ConfirmModalCallback;
  onCancel?: (closeModal: () => void) => void;
  onConfirm?: ConfirmModalCallback;
  confirmText?: string;
};

declare type ConfirmModalFn = (
  content: string,
  options: ConfirmModalOptions
) => void;
