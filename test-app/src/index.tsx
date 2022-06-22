/* @refresh reload */
import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import Monaco from "../..";

render(() => {
  const [val, setVal] = createSignal("");

  return (
    <>
      <h1>Monaco solid test</h1>
      <Monaco value={val()} lang="javascript" valOut={setVal} />
      <pre>
        <code>{val()}</code>
      </pre>
    </>
  );
}, document.querySelector("body") as HTMLElement);
