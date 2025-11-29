
// Polyfills for React Native environment
// This ensures compatibility with libraries that expect browser globals

// Only apply polyfills if we're in a non-browser environment
if (typeof window === 'undefined') {
  console.log('Applying React Native polyfills...');
  
  // Polyfill for window object in React Native
  // @ts-expect-error - Polyfill for React Native
  global.window = global;
  
  // Polyfill for self (used by some libraries)
  // @ts-expect-error - Polyfill for React Native
  global.self = global;
}

// Polyfill for document object (some libraries check for it)
if (typeof document === 'undefined') {
  // @ts-expect-error - Polyfill for React Native
  global.document = {
    createElement: () => ({}),
    getElementById: () => null,
    getElementsByTagName: () => [],
    getElementsByClassName: () => [],
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    body: {},
    head: {},
    documentElement: {},
  };
}

// Polyfill for localStorage (AsyncStorage will be used instead by Supabase)
if (typeof localStorage === 'undefined') {
  // @ts-expect-error - Polyfill for React Native
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };
}

// Polyfill for sessionStorage
if (typeof sessionStorage === 'undefined') {
  // @ts-expect-error - Polyfill for React Native
  global.sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    key: () => null,
    length: 0,
  };
}

// Polyfill for location
if (typeof location === 'undefined') {
  // @ts-expect-error - Polyfill for React Native
  global.location = {
    href: '',
    origin: '',
    protocol: '',
    host: '',
    hostname: '',
    port: '',
    pathname: '',
    search: '',
    hash: '',
  };
}

// Polyfill for navigator (if needed)
if (typeof navigator === 'undefined') {
  // @ts-expect-error - Polyfill for React Native
  global.navigator = {
    userAgent: 'ReactNative',
    platform: 'ReactNative',
  };
}

// Polyfill for performance
// @ts-expect-error - Polyfill for React Native
global.performance = global.performance || {};

// @ts-expect-error - Polyfill for React Native
global.performance.now =
  global.performance.now || (() => Date.now());

// @ts-expect-error - Polyfill for React Native
global.requestAnimationFrame =
  global.requestAnimationFrame || function (callback) {
    setTimeout(callback, 0);
  };

// @ts-expect-error - Polyfill for React Native
global.cancelAnimationFrame =
  global.cancelAnimationFrame || function (id) {
    clearTimeout(id);
  };

// @ts-expect-error - Polyfill for React Native
global.setImmediate =
  global.setImmediate || function (callback) {
    setTimeout(callback, 0);
  };

// @ts-expect-error - Polyfill for React Native
global.clearImmediate =
  global.clearImmediate || function (id) {
    clearTimeout(id);
  };

// @ts-expect-error - Polyfill for React Native
global.queueMicrotask =
  global.queueMicrotask || function (callback) {
    Promise.resolve().then(callback);
  };

console.log('Polyfills applied successfully');

export {};
