import Peer from 'peerjs';
import store from '../store';
import * as constants from '../../constants';

export const initializeOwnPeerObject = () => {
  const host = window.location.hostname;
  const port = window.location.port || (window.location.protocol === 'https:' ? 443 : 80);
  const path = '/peerjs';

  return new Peer({
    host,
    port,
    path,
    config: {
      iceServers: [
        { url: 'stun:stun1.l.google.com:19302' },
        { url: 'stun:stun2.l.google.com:19302' },
        { url: 'stun:stun3.l.google.com:19302' },
        { url: 'stun:stun4.l.google.com:19302' },
        {
          url: 'turn:numb.viagenie.ca',
          credential: 'Asp8&Viper',
          username: 'sienna.m.wood@gmail.com',
        },
      ],
    },
    debug: 1,
  });
};

export const getOwnId = () => (
  store.getState().p2p.id
);

export const ownUsernameIsSet = () => {
  const state = store.getState();
  const id = state.p2p.id;
  if (state.p2p.peers[id]) {
    return state.p2p.peers[id].username;
  }

  return false;
};

export const getUsername = (id) => {
  const peers = store.getState().p2p.peers;
  if (peers[id]) {
    if (peers[id].username) {
      return peers[id].username;
    }

    return peers[id].defaultUsername;
  }

  return undefined;
};

export const resolveIdsToUsernames = (ids) => {
  const usernames = ids.map(id => (
    getUsername(id)
  ));

  return usernames.join(' and ');
};

export const getPeerCount = () => {
  const peers = store.getState().p2p.peers;
  return Object.keys(peers).length;
};

export const allPeersReady = () => {
  const peers = store.getState().p2p.peers;

  return Object.keys(peers).every(id => (
    peers[id].status === constants.PEER_STATUS_READY
  ));
};
