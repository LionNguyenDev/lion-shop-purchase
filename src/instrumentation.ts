/** Runs once when the server boots; the Node-only work lives in its own file so the edge bundle never sees it */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation-node');
  }
}
