if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js", {
      scope: "/",
      type: "classic",
    })
    .then((params) => {
      console.log('Registered the service worker');
    })
    .catch((e) => {
      console.log();
    });
}
