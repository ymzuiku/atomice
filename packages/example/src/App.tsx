import { ChangeEventHandler } from "react";
import {
  Atom,
  Block,
  atom,
  atomWithStorage,
  staticComponent,
  useBlock,
} from "render-atom";

const name = atomWithStorage("local-state2", "");

const getData = async (name: string) => {
  await new Promise((res) => setTimeout(res, 100));
  return { name: name + "b" };
};

const Page = staticComponent(() => {
  const title = atom("");
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    title.setValue(e.target.value);
  };

  name.loadStorage();
  (async () => {
    const res = await getData(name.value);
    title.setValue(res.name);
  })();

  return (
    <div>
      <title.Render>
        {(v) => (
          <>
            title:
            <input value={v} onChange={onChange} />
            <Block>
              <div>
                input: <Input title={title} />
              </div>
            </Block>
          </>
        )}
      </title.Render>
      <div>
        <title.Render />
      </div>
    </div>
  );
});

const Input = staticComponent(({ title }: { title?: Atom<string> }) => {
  return useBlock(() => {
    return (
      <div>
        the-input:
        {title ? <title.Render /> : null}
        <name.Render>
          {() => (
            <input
              value={name.value}
              onChange={(e) => name.setValue(e.target.value)}
            />
          )}
        </name.Render>
        <div>
          <name.Render />
        </div>
      </div>
    );
  });
});

export function App() {
  return (
    <div>
      <Page />
      <Input />
    </div>
  );
}