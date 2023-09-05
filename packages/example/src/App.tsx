import {
  Atom,
  Block,
  atom,
  atomWithComputed,
  atomWithStorage,
  onMount,
  staticComponent,
  useRerender,
} from "atomice";
import { ChangeEventHandler } from "react";

const name = atomWithStorage("local-state2", "");

const getData = async (name: string) => {
  await new Promise((res) => setTimeout(res, 100));
  return { name: name + "-loaded" };
};

const Text = ({ text }: { text: Atom<string> }) => {
  useRerender(text);
  return <div>text: {text.value}</div>;
};

const Page = staticComponent(() => {
  const title = atom("");
  title.listen((value) => {
    console.log(value);
  });
  const bigName = atomWithComputed(
    () => name.value + title.value + "big",
    [name, title]
  );
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    title.setValue(e.target.value);
  };

  name.loadStorage();
  onMount(async () => {
    const res = await getData(name.value);
    title.setValue(res.name);
  });

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
        <Text text={title} />
        <bigName.Render />
      </div>
    </div>
  );
});

const Input = staticComponent(({ title }: { title?: Atom<string> }) => {
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

export function App() {
  return (
    <div>
      <Page />
      <Input />
    </div>
  );
}
