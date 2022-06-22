import { Component, createEffect, onCleanup, Setter } from "solid-js";
import loader, { Monaco } from "@monaco-editor/loader";
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

const processTheme = async (t: string, monaco: Monaco) => {
  if (!t || !t.trim()) return;

  const u = `https://cdn.esm.sh/monaco-themes@0.4.2/themes/${t}.json`;

  const theme = await fetch(u).then((r) => r.json());

  monaco.editor.defineTheme(t, theme);
};

export default ((props) => {
  let dispose: () => void;
  let cancel = false;

  const refCb = async (elem: HTMLDivElement) => {
    const monaco = await loader.init();
    if (cancel) return;

    await processTheme(props.theme, monaco);

    const ed = monaco.editor.create(elem, {
      language: props.lang,
      value: props.value,
      readOnly: props.readonly ?? false,
      theme: props.theme,
      ...props.otherCfg,
    });

    dispose = () => ed.dispose();

    // stops syntax highlighting flickering
    let valueAntiflicker = false;

    ed.onDidChangeModelContent(() => {
      valueAntiflicker = true;
      props.valOut?.(ed.getValue());
      valueAntiflicker = false;
    });

    createEffect(() => ed.updateOptions({ readOnly: props.readonly }));

    createEffect(() => {
      props.value;
      if (!valueAntiflicker) ed.setValue(props.value);
    });

    createEffect(async () => {
      await processTheme(props.theme, monaco);
      ed.updateOptions({ theme: props.theme });
    });

    createEffect(() => {
      const model = ed.getModel();
      if (!model) return;
      monaco.editor.setModelLanguage(model, props.lang);
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
