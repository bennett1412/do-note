if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js", {
      scope: "/",
      type: "classic",
    })
    .then((params) => {
      console.log(params);
    })
    .catch((e) => {
      console.log(e);
    });
}
