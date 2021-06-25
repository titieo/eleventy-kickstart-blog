import './styles/index.css';
import 'overlayscrollbars/js/OverlayScrollbars.min.js';
import '@fortawesome/fontawesome-free/js/all';
// Import Packages

import './scripts/scrollBar';
import Alpine from 'alpinejs';
import { themeChange } from 'theme-change';

import.meta.glob('./dir/*.js');

window.Alpine = Alpine;
Alpine.start();
themeChange();
