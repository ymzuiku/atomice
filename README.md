<img src="packages/ice-atom/logo.png" style="margin: 10px auto; text-align:center; height:200px" />

# Atomice

Atomice is a lightweight React tool designed to eliminate the use of all React Hooks and manage your entire application's updates using pure Render Props and Atom state management methods. With Atomice in practice, you will only update the parts you need.

## Key Features

- Pure: Everything is built on React's built-in API.
- Zero Dependencies: No additional dependencies or libraries are introduced, ensuring your project remains simple and lightweight.
- Flexibility: You can selectively have some components use Atomice while others continue to use the React API.

- Open Ecosystem: We encourage community participation and contributions, ensuring that Atomice's functionality continues to expand while maintaining maintainability and scalability.

## Use Cases

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

```jsx
import React from "react";
import { atom } from "atomice";

const name = atom("");

function App() {
  return (
    <div>
      <h1>My React App</h1>
      <input onChange={(e) => name.setValue(e.target.value)} />
      your input text: <atom.Render />
    </div>
  );
}

export default App;
````
