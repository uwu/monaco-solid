import { Component, createEffect, onCleanup, Setter } from "solid-js";
import loader from "@monaco-editor/loader";
import { editor } from "monaco-editor";

type CfgOpts = Omit<
  editor.IStandaloneEditorConstructionOptions,
  "language" | "value" | "readOnly"
>;

type MonacoCompType = Component<{
  lang: string;
  value: string;
  valOut?: Setter<string>;
  readonly?: boolean;
  otherCfg?: CfgOpts;
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
      ...props.otherCfg,
    });

    dispose = ed.dispose;

    ed.onDidChangeModelContent(() => props.valOut?.(ed.getValue()));

    createEffect(() => ed.updateOptions({ readOnly: props.readonly }));
    createEffect(() => ed.setValue(props.value));
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

  return <div ref={refCb} />;
}) as MonacoCompType;
