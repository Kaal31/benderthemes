const { React, ThemeRoot, openDestination } = host;
const h = React.createElement;
function Home({ home }) {
  return h(ThemeRoot, { onInput: () => false },
    h('div', { style: { padding: 40, color: 'white', background: '#172133', height: '100%' } },
      h('h1', null, 'Native demo home'),
      h('p', null, `${home.lib.games.length} games`),
      ...['library', 'store', 'friends', 'downloads', 'settings'].map(place =>
        h('button', { key: place, onClick: () => openDestination({ place }) }, `Native ${place}`))));
}
function Page({ destination, onClose, request }) {
  const [message, setMessage] = React.useState('');
  return h('div', { style: { position: 'absolute', inset: 0, zIndex: 100, padding: 40, background: '#253555', color: 'white' } },
    h('h1', null, `Native page: ${destination.place}`),
    h('button', { onClick: onClose }, 'Close native page'),
    h('button', { onClick: () => request('friends', {}).then(() => setMessage('Host request completed')).catch(e => setMessage(String(e))) }, 'Request friends'),
    h('p', null, message));
}
return { Home, pages: Object.fromEntries(['library', 'store', 'friends', 'downloads', 'settings'].map(p => [p, Page])),
  dispose() { window.__nativeDisposals = (window.__nativeDisposals || 0) + 1; } };
