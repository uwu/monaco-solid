# Monaco for Solid

This is a component that wraps Microsoft's great Monaco editor for Solid.

All props are reactive.

See below for (pretty self explanatory) usage. Comes with TS defs.

You may use any theme from
[*here*](https://github.com/brijeshb42/monaco-themes/tree/master/themes)
by name.

You can use monaco from an npm package by passing to `props.noCDN`.
This will only do anything on the first render of any `<Monaco>`,
and will apply to all later uses of the component.

If you do not do this, monaco will just be loaded from jsDelivr.

```tsx
import {createSignal} from "solid-js";
import Monaco from "monaco-solid";
import * as monaco from "monaco-editor"

export default () => {
  const [val, setVal] = createSignal("");

  return (
    <>
      <Monaco
        value={val()} // required
        valOut={setVal}
        lang="javascript" // required
        theme="Monokai"
        readonly={false}
        height="30rem"
        width="20rem"
        otherCfg={{}}
        noCDN={monaco}
      />
      <pre><code>{val()}</code></pre>
    </>
  );
}
```