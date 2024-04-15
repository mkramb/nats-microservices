export const waitForMs = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
