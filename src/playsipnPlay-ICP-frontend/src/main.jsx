import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import Modal from 'react-modal';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from './utils/redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import TagManager from 'react-gtm-module'
 
const tagManagerArgs = {
    gtmId: 'GTM-WM9KD87'
}

TagManager.initialize(tagManagerArgs);

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
