<img src="packages/atomice/logo.png" style="margin: 10px auto; text-align:center; height:200px" />

# Atomice

The main feature of Atomice is that it defines a set of solutions based on Render Props, thereby avoiding the entire component rendering impact of Hooks. Render Props is a JSX-based feature known for its exceptional stability and reliability.

The essence of this approach is sacrificing some readability in exchange for fewer side effects.

## Key Features

- **Render Props Approach**: Atomice offers an alternative state management method based on Render Props, allowing you to precisely control component rendering. Through Render Props, you can selectively pass state to components without worrying about re-rendering the entire component.

- **Avoiding Hooks Impact**: Atomice is designed to prevent Hooks from affecting the entire component's rendering. With Atomice, you gain more flexibility in managing component state and behavior without being forced into impacting the entire component tree.

- **Stability**: Render Props is a stable feature in React, widely used in many projects and proven over time. Atomice leverages this stability to provide you with reliable state management.

## Use Cases

- If you wish to utilize the stability of Render Props in React and better manage component state and behavior, Atomice is a powerful tool.
- If you aspire to the rendering approach of SolidJS but don't want to leave the React ecosystem, Atomice can provide performance close to SolidJS within the world of React.
- If you are tired of managing dependencies repeatedly with Hooks or frustrated with unintentional cyclic rendering caused by improper useEffect usage, you can consider trying Atomice's solution.

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

// You can execute outside the component
onMount(() => {
  cnosole.log(name.value);
});

// You can execute outside the component
name.setValue("other-value");

function App() {
  // It's ok
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
