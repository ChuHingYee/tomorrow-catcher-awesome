import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [imgsList, setImgsList] = useState<string[]>([]);
  const addCount = () => {
    setCount((num) => {
      return num + 1;
    });
  };
  const throwImgError = () => {
    setImgsList([...imgsList, 'iAmReactImg.png']);
  };
  const throwScriptError = () => {
    const src = './iamReactScript.js';
    const _script = document.createElement('script');
    _script.src = src;
    _script.type = 'text/javascript';
    const head = document.getElementsByTagName('head').item(0); // 这个是往本页面动态加载js脚本
    head!.appendChild(_script);
  };
  const throwPromiseError = () => {
    Promise.reject(new Error('iAmReactPromiseError'));
  };
  if (count === 2) {
    // Simulate a JS error
    throw new Error('I crashed!');
  }
  return (
    <div className='app'>
      <div className='app-wrap'>
        <button onClick={addCount}>
          please click: {count} trigger normal error
        </button>
      </div>
      <div className='app-wrap'>
        <button onClick={throwImgError}>throw image load error</button>
        {imgsList.map((item, index) => {
          return <img src={item} key={index} />;
        })}
      </div>
      <div className='app-wrap'>
        <button onClick={throwScriptError}>throw script load error</button>
      </div>
      <div className='app-wrap'>
        <button onClick={throwPromiseError}>throw promise error</button>
      </div>
    </div>
  );
}

export default App;
