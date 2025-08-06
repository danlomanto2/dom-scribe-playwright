import { createRoot } from 'react-dom/client';
import { Popup } from './popup';
import '../index.css';

// Entry point for the extension popup
const container = document.getElementById('popup-root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}