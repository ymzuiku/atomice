<img src="/logo.png" style="margin: 10px auto; text-align:center; height:200px" />

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

## Example

### create atom

```jsx
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
```

### like useState atom

Use `staticComponent` that are never repainted by their parent：

```jsx
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
