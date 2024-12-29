if (typeof global === "undefined") {
  (window as any).global = window;
}

if (typeof Buffer === "undefined") {
  import("buffer").then(({ Buffer }) => {
    (window as any).Buffer = Buffer;
  });
}
