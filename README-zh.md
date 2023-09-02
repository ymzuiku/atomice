<img src="packages/atomice/logo.png" style="margin: 10px auto; text-align:center; height:200px" />

# Atomice

Atomice 的特点是定义了一套基于 Render Props 的解决方案，以避免 Hooks 影响整个组件的渲染。Render Props 是基于 JSX 的特性，具有出色的稳定性和可靠性。

这个方案的本质是牺牲部分可读性，换来更少的副作用

## 主要特点

- **Render Props 方案**: Atomice 基于 Render Props 提供了一种不同的状态管理方法，使您能够更精确地控制组件的渲染。通过 Render Props，您可以选择性地将状态传递给组件，而不必担心整个组件的重新渲染。

- **避免 Hooks 影响**: Atomice 的设计目标是防止 Hooks 对整个组件的渲染产生影响。使用 Atomice，您可以更灵活地管理组件的状态和行为，而不会被强制性地影响整个组件树。

- **稳定性**: Render Props 是 React 中的一项稳定特性，已经在许多项目中广泛使用并经受了时间的考验。Atomice 利用这一稳定性，为您提供可信赖的状态管理方法。

## 适用场景

- 如果你向往 SolidJS 的渲染方式， 又不愿意离开 React 的生态， Atomice 可以在 React 的世界中给于你接近 SolidJS 的性能。
- 如果你厌倦了反复的管理 hooks 的依赖， 厌倦了不小心错误使用 useEffect 导致的循环渲染， 你可以尝试 atomice 的方案

## Installation

````sh
npm install benefits
# Or
yarn add benefits
# Or
pnpm i benefits

## Example

[Example](https://github.com/ymzuiku/atomice/tree/main/packages/example)

## How to use

### create atom

```tsx
import { atom } from "atomice";

// global atom
const name = atom("");

function App() {
  const handleChange = (e) => name.setValue(e.target.value);
  return (
    <div>
      <h1>My React App</h1>
      <input onChange={handleChange} />
      your input text: <name.Render />
    </div>
  );
}

export default App;
````

### like useState atom

Use `staticComponent` that are never repainted by their parent：

```tsx
import { atom, staticComponent } from "atomice";

const app = staticComponent(() => {
  console.log("onle-render-once");

  const name = atom("");
  const handleChange = (e) => name.setValue(e.target.value);

  return (
    <div>
      <h1>My React App</h1>
      <input onChange={handleChange} />
      your input text: <name.Render />
    </div>
  );
});

export default App;
```

> Principle: `const staticComponent = (fn)=> React.memo(fn, ()=>false)`

### Use atom props

Use `atomWithStorage` can auto load and save data to localStorage:

Typescript example:

```tsx
import { staticComponent, atom, Atom } from "atomice";

function App() {
  console.log("onle-render-once");

  const name = atom("");
  return (
    <div>
      <h1>My React App</h1>
      <Input name={name} />
      <Text name={name} />
      <ErrorText name={name.value} />
    </div>
  );
}

const Input = staticComponent(({ name }: { name: Atom<string> }) => {
  console.log("onle-render-once");

  return (
    <input value={name.value} onChange={(e) => name.setValue(e.target.value)} />
  );
});

// This component won't update because you're passing the value of name.value, which doesn't trigger updates. To trigger an update, you must wrap it in name.Render for rendering.
const ErrorText = ({ name }: { name: string }) => {
  return <p>Your input text: {name}</p>;
};

// Success, It's work!
const Text = staticComponent(({ name }: { name: Atom<string> }) => {
  console.log("onle-render-once");

  return (
    <p>
      Your input text: <name.Render />
    </p>
  );
});

export default staticComponent(App);
```

### Use render props and Block

```jsx
import { atom, staticComponent, Block } from "atomice";

const app = staticComponent(() => {
  console.log("onle-render-once");

  const name = atom({ name: "hello", age: 30 });
  const handleChangeName = (e) =>
    name.setValue((v) => ({ ...v, name: e.target.value }));
  const handleChangeAge = () =>
    name.setValue((v) => ({ ...v, age: v.age + 1 }));

  return (
    <div>
      <h1>My React App</h1>
      <name.Render>
        {(v) => {
          return (
            <div>
              <h2>Name: {v.name}</h2>
              <h3>Age: {v.age}</h3>
              {/* Use <Block>...</Block>, Will not be affected by name-atom re-render */}
              <Block>
                <OtherComponent />
              </Block>
            </div>
          );
        }}
      </name.Render>
      <name.Render>
        {(v) => {
          return <input value={v.name} onChange={handleChangeName} />;
        }}
      </name.Render>
      <button onClick={handleAddAge}>Add age</button>
    </div>
  );
});

export default App;
```

> Principle: `const staticComponent = (fn)=> React.memo(fn, ()=>false)`

### useRereder

Sometimes we need to escape precise updates, use `useRerender`:

```tsx
import { staticComponent, atom, Atom } from "atomice";

function App() {
  console.log("onle-render-once");

  const name = atom("");
  return (
    <div>
      <h1>My React App</h1>
      <input
        value={name.value}
        onChange={(e) => name.setValue(e.target.value)}
      />
      <Text name={name} />
    </div>
  );
}

const Text = ({ name }: { name: Atom<string> }) => {
  console.log("render-every-changed");
  useRerender(name);
  return <p>Your input text: {name.value}</p>;
};

// Success, It's work!
const Text = staticComponent(({ name }: { name: Atom<string> }) => {
  console.log("onle-render-once");

  return (
    <p>
      Your input text: <name.Render />
    </p>
  );
});

export default staticComponent(App);
```

### LocalStorage atom

Use `atomWithStorage` can auto load and save data to localStorage:

```jsx
import { atomWithStorage } from "atomice";

// global atom
const name = atomWithStorage("local-key", "");

function App() {
  const handleChange = (e) => name.setValue(e.target.value);
  return (
    <div>
      <h1>My React App</h1>
      <input onChange={handleChange} />
      your input text: <name.Render />
    </div>
  );
}

export default App;
```

### onMount

onMount is wait atomWithStorage loaded data:

```tsx
import { atomWithStorage } from "atomice";

// global atom
const name = atomWithStorage("local-key", "");

function App() {
  onMount(() => {
    cnosole.log(name.value);
  });
  const handleChange = (e) => name.setValue(e.target.value);
  return (
    <div>
      <h1>My React App</h1>
      <input onChange={handleChange} />
      your input text: <name.Render />
    </div>
  );
}

export default App;
```
