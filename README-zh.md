# Atomice

atomice 是一个轻量级的 React 工具，旨在移除所有 react hooks 的使用，使用存粹的 render props + atom 的状态管理方法管理你整个应用的更新。通过 atomice 的实践，你只会更新你所需要的部分。

## 主要特点

- 纯粹的: 一切都建立在 React 自带的 API 上。
- 零依赖: 不引入任何额外的依赖项或库，确保您的项目保持简单和轻量级。
- 灵活性: 你可以可选的让部分组件使用 atomice，而另外一部分组件沿用 react API。

开放式生态系统: 我们鼓励社区参与和贡献，使 Atomice 的功能不断扩展，同时保持可维护性和可扩展性。

## 适用场景

- 如果你向往 SolidJS 的渲染方式， 又不愿意离开 React 的生态， Atomice 可以在 React 的世界中给于你接近 SolidJS 的性能。
- 如果你厌倦了反复的管理 hooks 的依赖， 厌倦了不小心错误使用 useEffect 导致的循环渲染， 你可以尝试 atomice 的方案

## 安装

```sh
npm install benefits
# Or
yarn add benefits
# Or
pnpm i benefits
```

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
```
