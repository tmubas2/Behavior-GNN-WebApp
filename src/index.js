import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Calibration from './Calibration';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Hidden calibration harness for the Session 1 probe study — not part of the normal
// participant flow. Reached only via a URL like yourapp.com/?calibrate=SS1
const params = new URLSearchParams(window.location.search);
const calibrateScreen = params.get('calibrate');

if (calibrateScreen && ['SS1', 'SS2', 'SS3'].includes(calibrateScreen)) {
  root.render(<Calibration screenId={calibrateScreen} />);
} else {
  root.render(<App />);
}