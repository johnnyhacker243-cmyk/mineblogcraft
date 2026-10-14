/* Mineblogcraft host bridge. The upstream game script is unchanged. */
(function () {
  const canvas = document.getElementById("canvas");
  const log = document.getElementById("logmsg");
  const send = (state, detail = "") => {
    document.body.dataset.state = state;
    log.textContent = state === "running" ? "" : detail;
    if (parent !== window)
      parent.postMessage(
        { type: "mineworld:state", state, detail },
        location.origin,
      );
  };
  let filesystemStarted = false;
  let running = false;
  const resize = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);
  const requestedName = new URLSearchParams(location.search).get("username");
  canvas.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("pointerlockerror", () => {
    if (parent !== window)
      parent.postMessage(
        {
          type: "mineworld:notice",
          detail:
            "鼠标锁定被浏览器拒绝。可使用独立 Chrome / Edge 浏览器打开游戏。",
        },
        location.origin,
      );
  });
  canvas.addEventListener("webglcontextlost", () =>
    send("error", "Graphics context lost. Reload to retry."),
  );
  window.Module = {
    canvas,
    arguments: [
      requestedName && /^[A-Za-z0-9_]{1,16}$/.test(requestedName)
        ? requestedName
        : "MineWorldPlayer",
    ],
    preRun: [],
    postRun: [],
    print: (...args) => console.log("[ClassiCube]", ...args),
    printErr: (...args) => console.error("[ClassiCube]", ...args),
    setStatus(text) {
      if (text.includes("Preloading filesystem")) filesystemStarted = true;
      if (text) send("loading", text);
      else if (filesystemStarted && !running) {
        running = true;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            send("running");
            canvas.focus();
          }),
        );
      }
    },
    onAbort() {
      send("error", "ClassiCube could not start. Reload to retry.");
    },
    locateFile: (name) => new URL(name, location.href).href,
  };
  window.addEventListener("error", (event) => {
    if (
      String(event.message).includes("unwind") ||
      String(event.message).includes("SimulateInfiniteLoop")
    )
      return;
    send("error", "Game load failed. Reload to retry.");
  });
  send("loading", "Loading ClassiCube...");
  // ClassiCube falls back to an untextured game when default.zip is missing.
  // Fail visibly instead, without modifying its original download code.
  fetch("/static/default.zip", { method: "HEAD" })
    .then((response) => {
      if (
        !response.ok ||
        response.headers.get("content-type")?.includes("text/html")
      )
        throw new Error("Texture pack unavailable");
      const script = document.createElement("script");
      script.src = new URL("ClassiCube.js", location.href).href;
      script.onerror = () =>
        send("error", "ClassiCube script unavailable. Reload to retry.");
      document.body.appendChild(script);
    })
    .catch(() =>
      send("error", "Default texture pack unavailable. Reload to retry."),
    );
})();
