// "Shelf": a test community interface. Runs sealed off from Steam and talks to
// Deck Home Themes only through postMessage (see docs/THEME-FORMAT.md).
(function () {
  "use strict";
  var PROTOCOL = 1;
  var games = [];
  var focus = 0;
  var clock24 = false;
  var saved = null;
  var wallpaper = null;

  function send(msg) {
    msg.dht = PROTOCOL;
    parent.postMessage(msg, "*");
  }

  var shelf = document.getElementById("shelf");
  var title = document.getElementById("title");
  var meta = document.getElementById("meta");
  var backdrop = document.getElementById("backdrop");

  function hours(min) {
    if (!min) return "Not played yet";
    return min < 60 ? min + " min played" : Math.round(min / 6) / 10 + " h played";
  }

  function render() {
    shelf.innerHTML = "";
    games.forEach(function (g, i) {
      var card = document.createElement("div");
      card.className = "card";
      var art = g.art.portrait[0];
      if (art) {
        card.style.backgroundImage = "url(\"" + art.replace(/"/g, "%22") + "\")";
        card.classList.add("has-art");
      }
      var name = document.createElement("div");
      name.className = "name";
      name.textContent = g.name;
      card.appendChild(name);
      card.addEventListener("click", function () {
        if (focus === i) send({ type: "launch", appid: g.appid });
        else setFocus(i, true);
      });
      shelf.appendChild(card);
    });
    setFocus(Math.min(focus, Math.max(0, games.length - 1)), false);
  }

  function setFocus(i, sound) {
    if (!games.length) {
      title.textContent = "No games in this view";
      meta.textContent = "";
      return;
    }
    if (i < 0 || i >= games.length) {
      if (sound) send({ type: "sound", name: "end" });
      return;
    }
    if (sound && i !== focus) send({ type: "sound", name: "move" });
    focus = i;
    var cards = shelf.children;
    for (var k = 0; k < cards.length; k++) cards[k].classList.toggle("focus", k === i);
    var step = cards[0] ? cards[0].getBoundingClientRect().width + 18 : 186;
    shelf.style.transform = "translateX(" + -Math.max(0, i - 2) * step + "px)";
    var g = games[i];
    title.textContent = g.name;
    meta.textContent = (g.installed ? "Installed" : "Not installed") + " · " + hours(g.playtime);
    var hero = g.art.hero[0] || g.art.landscape[0] || wallpaper;
    if (hero) {
      backdrop.className = "art";
      backdrop.style.backgroundImage = "url(\"" + hero.replace(/"/g, "%22") + "\")";
    } else {
      backdrop.className = "";
      backdrop.style.backgroundImage = "";
    }
    send({ type: "hints", a: g.installed ? "Play" : "Install" });
  }

  function remember() {
    var g = games[focus];
    if (g) send({ type: "save", data: { lastAppid: g.appid } });
  }

  function onInput(btn) {
    if (btn === "left") setFocus(focus - 1, true);
    else if (btn === "right") setFocus(focus + 1, true);
    else if (btn === "l1") setFocus(Math.max(0, focus - 5), true);
    else if (btn === "r1") setFocus(Math.min(games.length - 1, focus + 5), true);
    else if (btn === "a" && games[focus]) {
      remember();
      send({ type: "sound", name: "launch" });
      send({ type: "launch", appid: games[focus].appid });
    } else if (btn === "x" && games[focus]) send({ type: "details", appid: games[focus].appid });
    else if (btn === "up") send({ type: "open", place: "store" });
    else if (btn === "down") send({ type: "open", place: "library" });
  }

  function tick() {
    var d = new Date();
    var h = d.getHours();
    var m = String(d.getMinutes()).padStart(2, "0");
    document.getElementById("clock").textContent = clock24 ? String(h).padStart(2, "0") + ":" + m : ((h + 11) % 12 + 1) + ":" + m + (h < 12 ? " AM" : " PM");
  }
  setInterval(tick, 10000);

  window.addEventListener("message", function (e) {
    if (e.source !== parent) return;
    var m = e.data;
    if (!m || m.dht !== PROTOCOL) return;
    if (m.type === "state") {
      var first = !games.length && saved === null;
      games = m.games || [];
      clock24 = !!(m.settings && m.settings.clock24);
      document.body.classList.toggle("still", !(m.settings && m.settings.animations));
      if (m.settings && m.settings.accent) document.documentElement.style.setProperty("--accent", m.settings.accent);
      document.getElementById("user").textContent = m.user || "Player";
      wallpaper = (m.slots && m.slots.wallpaper) || null;
      if (m.slots && m.slots.font && !document.getElementById("theme-font")) {
        var st = document.createElement("style");
        st.id = "theme-font";
        st.textContent = '@font-face{font-family:"theme-font";src:url("' + m.slots.font.replace(/"/g, "%22") + '")}body{font-family:"theme-font",system-ui,sans-serif}';
        document.head.appendChild(st);
      }
      saved = m.saved || {};
      if (first && saved.lastAppid) {
        for (var i = 0; i < games.length; i++) if (games[i].appid === saved.lastAppid) focus = i;
      }
      tick();
      render();
    } else if (m.type === "input") onInput(m.btn);
  });

  // ── what the sandbox lets this page do (shown on screen for testing) ──
  function mark(name, ok, text) {
    var el = document.querySelector('[data-check="' + name + '"]');
    el.className = ok ? "ok" : "bad";
    el.textContent = text;
  }
  try {
    fetch("https://example.com/", { mode: "no-cors" }).then(
      function () { mark("network", false, "Internet: reachable"); },
      function () { mark("network", true, "Internet: blocked"); }
    );
  } catch (err) {
    mark("network", true, "Internet: blocked");
  }
  try {
    var t = parent.document.title;
    mark("parent", false, "Steam page: readable (" + t + ")");
  } catch (err) {
    mark("parent", true, "Steam page: sealed off");
  }
  try {
    localStorage.setItem("x", "1");
    mark("storage", false, "Browser storage: available");
  } catch (err) {
    mark("storage", true, "Browser storage: none");
  }

  // say hello until the plugin answers (it may still be setting up when this page loads)
  var hello = function () { send({ type: "ready", handles: ["left", "right", "up", "down", "a", "x", "l1", "r1"] }); };
  hello();
  var retry = setInterval(function () { if (saved !== null) clearInterval(retry); else hello(); }, 1000);
})();
