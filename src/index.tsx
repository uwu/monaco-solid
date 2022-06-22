import { Component, createEffect, onCleanup, Setter } from "solid-js";
import loader from "@monaco-editor/loader";
import { editor } from "monaco-editor";

type CfgOpts = Omit<
  editor.IStandaloneEditorConstructionOptions,
  "language" | "value" | "readOnly" | "theme"
>;

type MonacoCompType = Component<{
  lang: string;
  value: string;
  valOut?: Setter<string>;
  readonly?: boolean;
  theme?: string;
  otherCfg?: CfgOpts;
  height?: string;
  width?: string;
}>;

export default ((props) => {
  let dispose: () => void;
  let cancel = false;

  const refCb = async (elem: HTMLDivElement) => {
    const monaco = await loader.init();
    if (cancel) return;

    const ed = monaco.editor.create(elem, {
      language: props.lang,
      value: props.value,
      readOnly: props.readonly ?? false,
      theme: props.theme,
      ...props.otherCfg,
    });

    dispose = ed.dispose;

    ed.onDidChangeModelContent(() => props.valOut?.(ed.getValue()));

    createEffect(() => ed.updateOptions({ readOnly: props.readonly }));
    createEffect(() => ed.setValue(props.value));
    createEffect(() => ed.updateOptions({ theme: props.theme }));
    createEffect(() => {
      const model = ed.getModel();
      if (!model) return;
      editor.setModelLanguage(model, props.lang);
      ed.setModel(model);
    });
  };

  onCleanup(() => {
    cancel = true;
    dispose?.();
  });

  return (
    <div
      ref={refCb}
      style={{ width: props.width ?? "30rem", height: props.height ?? "10rem" }}
    />
  );
}) as MonacoCompType;
