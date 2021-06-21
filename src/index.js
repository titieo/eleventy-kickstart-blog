import './index.css';
import 'overlayscrollbars/css/OverlayScrollbars.min.css';
// Add CSS

import Alpine from 'alpinejs';
import 'overlayscrollbars/js/OverlayScrollbars.min.js';
import { themeChange } from 'theme-change';
import '@fortawesome/fontawesome-free/js/all';
// Import Packages

import './js/scrollBar';

window.Alpine = Alpine;
Alpine.start();
themeChange();
