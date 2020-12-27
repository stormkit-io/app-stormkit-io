type errorWithJsx = null | string | JsxElement | Array<JsxElement>;

declare type SetErrorWithJSX = (val: errorWithJsx) => void;
declare type SetError = (val: null | string) => void;
declare type SetLoading = (val: boolean) => void;
declare type ToggleModal = (val: boolean, cb?: () => void) => void;
declare type CloseModal = (cb: () => void) => void;
