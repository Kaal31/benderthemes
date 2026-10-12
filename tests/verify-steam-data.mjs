// Pure checks for src/steamData.ts (plain Node, no browser): playtime / last played of a non-Steam shortcut,
// hidden flags and friend nicknames. See handoff-notes/bugfixes-2026-10-12.md.
import assert from 'node:assert/strict';
import { applyNicknames, friendFullName, friendName, isHiddenApp, nicknameOf, readLastPlayed, readPlaytime } from '../src/steamData.ts';

// playtime: number, numeric string, other field names, the app details store, nothing
assert.equal(readPlaytime({ minutes_playtime_forever: 125 }), 125);
assert.equal(readPlaytime({ minutes_playtime_forever: '42.6' }), 43);
assert.equal(readPlaytime({ minutes_playtime_forever: 0, nPlaytimeForever: 90 }), 90);
assert.equal(readPlaytime({ minutes_playtime_forever: 0 }), 0);
assert.equal(readPlaytime({}), 0);
assert.equal(readPlaytime(null), 0);
globalThis.appDetailsStore = { GetAppDetails: (id) => (id === 7 ? { nPlaytimeForever: 185 } : null) };
assert.equal(readPlaytime({ appid: 7, minutes_playtime_forever: 0 }), 185);
assert.equal(readPlaytime({ appid: 8, minutes_playtime_forever: 0 }), 0);
globalThis.appDetailsStore = { GetAppDetails: () => { throw new Error('boom'); } };
assert.equal(readPlaytime({ appid: 7 }), 0);
delete globalThis.appDetailsStore;

// last played: the local field when Steam's own is missing (shortcuts)
assert.equal(readLastPlayed({ rt_last_time_played: 100, rt_last_time_locally_played: 50 }), 100);
assert.equal(readLastPlayed({ rt_last_time_played: 0, rt_last_time_locally_played: 50 }), 50);
assert.equal(readLastPlayed({}), 0);

// hidden
const hid = new Set([5003]);
assert.equal(isHiddenApp({ appid: 5003 }, hid), true);
assert.equal(isHiddenApp({ appid: 1 }, hid), false);
assert.equal(isHiddenApp({ appid: 1, visible_in_game_list: false }, hid), true);
assert.equal(isHiddenApp({ appid: 1, visible_in_game_list: true }, hid), false);

// nicknames
const kai = { persona: { m_strPlayerName: 'Kaida', m_strNickname: 'Kai', m_steamid: '1' } };
const plain = { persona: { m_strPlayerName: 'Orrin', m_steamid: '2' } };
const same = { persona: { m_strPlayerName: 'Mei', m_strNickname: 'Mei' } };
assert.equal(nicknameOf(kai), 'Kai');
assert.equal(friendName(kai), 'Kai');
assert.equal(friendFullName(kai), 'Kai (Kaida)');
assert.equal(friendName(plain), 'Orrin');
assert.equal(friendFullName(plain), 'Orrin');
assert.equal(nicknameOf(same), '');
assert.equal(nicknameOf({ persona: { m_strPlayerName: 'Sable', m_steamid: '9' } }, { GetNickname: (id) => (id === '9' ? 'Saz' : '') }), 'Saz');
assert.equal(nicknameOf({ nickname: ' Rook ', persona: { m_strPlayerName: 'R' } }), 'Rook');
const names = [{ persona: 'Kaida', nickname: 'Kai' }, { persona: 'a.b', nickname: 'AB' }];
assert.equal(applyNicknames('Kaida invited you to play', names), 'Kai invited you to play');
assert.equal(applyNicknames('New message from Kaida', names), 'New message from Kai');
assert.equal(applyNicknames('Kaidas sword, KaidaX', names), 'Kaidas sword, KaidaX', 'only whole names');
assert.equal(applyNicknames('axb and a.b', names), 'axb and AB', 'regex characters are literal');
assert.equal(applyNicknames('Kaida and Kaida', names), 'Kai and Kai');
console.log('steam data ok');
