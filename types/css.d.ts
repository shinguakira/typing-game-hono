// Ambient declaration for side-effect CSS imports (e.g. `import './globals.css'`).
// The native type checker (tsgo) requires a declaration for these; the old tsc
// resolved them leniently without one.
declare module '*.css';
