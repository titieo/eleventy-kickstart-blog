import 'overlayscrollbars/js/OverlayScrollbars.min.js';
import '@fortawesome/fontawesome-free/js/all';
// Import Packages

import './scripts/scrollBar';

import Alpine from 'alpinejs';
import { themeChange } from 'theme-change';

window.Alpine = Alpine;
Alpine.start();
themeChange();
