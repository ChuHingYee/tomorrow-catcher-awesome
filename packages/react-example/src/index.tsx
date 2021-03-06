import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  init,
  ErrorBoundary,
  ErrorBoundaryProps,
} from '@tomorrow-catcher/react';

init({
  key: '6240417964dcee1bc227aeaf',
  expireDate: 0,
  reportUrl: 'http://127.0.0.1:7001/api/logs',
  trackDepth: 1,
  handlersList: ['lag', 'sourceLoad', 'unhandledrejection'],
});

function errorComponent() {
  return (
    <div className='App'>
      <span>i am custom error compontet</span>
    </div>
  );
}

const beforeUpload: ErrorBoundaryProps['beforeUpload'] = function (
  err,
  errInfo,
) {
  console.log(err);
  return {
    customForm: `i am ${errInfo}`,
  };
};

ReactDOM.render(
  <ErrorBoundary errorComponent={errorComponent()} beforeUpload={beforeUpload}>
    <App />
  </ErrorBoundary>,
  document.getElementById('root'),
);
