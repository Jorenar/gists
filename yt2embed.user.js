// ==UserScript==
// @name         Redirect YouTube to embed version
// @version      1.2.4
// @description
// @run-at       document-start
// @match        https://*.youtube.com/*
// @match        https://*.youtube-nocookie.com/*
// @grant        window.onurlchange
// ==/UserScript==

"use strict";

function main() {
  const orig_params = new URLSearchParams(window.location.search);
  const orig_segments = window.location.pathname.split('/');
  const previousURL = sessionStorage.getItem('previousURL');

  const id = (() => {
    switch (orig_segments[1]) {
      case "embed":
      case "shorts":
        return orig_segments[2];
      case "watch":
        return orig_params.get('v');
      default:
        return null;
    }
  })();

  if (id == null) {
    return;
  }

  if (orig_segments[1] == "embed") {
    if (orig_params.get('original_url')) {
      sessionStorage.setItem('original_url', orig_params.get('original_url'));
      const url = new URL(window.location.href);
      url.searchParams.delete('original_url');
      window.location.replace(url);
    } else {
      const origURL = sessionStorage.getItem('original_url');
      if (origURL?.includes(id)) {
        window.history.replaceState({}, null, origURL);
      }
      sessionStorage.removeItem('original_url');
    }
    return;
  }

  if (previousURL?.includes(id)) {
    return;
  }

  const url = new URL(window.location.origin + '/embed/' + id);

  if (orig_params.has('list')) {
    url.search = '&videoseries'
    url.searchParams.append('list', orig_params.get('list'));
  }

  if (orig_params.has('t')) {
    url.searchParams.append('start', orig_params.get('t').replace('s', ''));
  } else if (orig_params.has('time_continue')) {
    url.searchParams.append('start', orig_params.get('time_continue'));
  }

  url.searchParams.append("original_url", window.location.href);
  window.location.replace(url);
}

window.addEventListener('beforeunload', function() {
 sessionStorage.setItem('previousURL', window.location.href);
});
window.onurlchange = main;
main();
