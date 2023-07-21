// service-worker.js

import { precacheAndRoute } from 'workbox-precaching';

// Files to be cached during service worker installation
precacheAndRoute(self.__WB_MANIFEST);
