# Monaco for Solid

This is a component that wraps Microsoft's great Monaco editor for Solid.

All props are reactive except for `otherCfg`, which is only assigned at first render.

See below for (pretty self explanatory) usage. Comes with TS defs.

You may use any theme from
[*here*](https://github.com/brijeshb42/monaco-themes/tree/master/themes)
by name.

```tsx
import {createSignal} from "solid-js";
import Monaco from "monaco-solid";

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
      />
      <pre><code>{val()}</code></pre>
    </>
  );
}
```