import store from '../redux/store';
import * as constants from '../constants';

import * as metaActions from '../redux/metaActionCreators';

import * as boardActions from '../redux/board/boardActionCreators';
import * as headSetActions from '../redux/headSet/headSetActionCreators';
import * as infoActions from '../redux/info/infoActionCreators';
import * as p2pActions from '../redux/p2p/p2pActionCreators';
import * as snakeActions from '../redux/snake/snakeActionCreators';

import * as snakeHelpers from '../redux/snake/snakeHelpers';

describe('Meta action creators', () => {
  describe('handleTuTick thunk', () => {
    const dispatchSpy = jest.fn();
    const id = 'egnkndv54678';

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof metaActions.handleTuTick(id)).toBe('function');
    });

    it('calls snakeHelpers.snakeIsAlive', () => {
      const spy = jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls snakeActions.writeOwnSnakePosition and snakeActions.checkForCollisions if snake is alive', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (true));
      const writeSpy = jest.spyOn(snakeActions, 'writeOwnSnakePosition');
      const collisionsSpy = jest.spyOn(snakeActions, 'checkForCollisions');

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(writeSpy).toHaveBeenCalledTimes(1);
      expect(collisionsSpy).toHaveBeenCalledTimes(1);
    });

    it('calls dispatch with infoActions.fastForwardTu if snake is dead', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (false));
      jest.spyOn(p2pActions, 'p2pBroadcastOwnDeath').mockImplementation(() => {});
      jest.spyOn(infoActions, 'fastForwardTu').mockImplementation(() => {});

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.fastForwardTu(id));
    });

    it('calls snakeActions.checkForLatentSnakes', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (false));
      const spy = jest.spyOn(snakeActions, 'checkForLatentSnakes');

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls infoActions.incrementTu', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (false));
      const spy = jest.spyOn(infoActions, 'incrementTu');

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls boardActions.getNextBoard', () => {
      jest.spyOn(snakeHelpers, 'snakeIsAlive').mockImplementation(() => (false));
      const spy = jest.spyOn(boardActions, 'getNextBoard');

      metaActions.handleTuTick(id)(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('receiveSnakeData thunk', () => {
    const dispatchSpy = jest.fn();

    const id = 'egnkndv54678';
    const data = {};

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof metaActions.receiveSnakeData()).toBe('function');
    });

    it('calls snakeHelpers.getTuGap with passed id and data', () => {
      const spy = jest.spyOn(snakeHelpers, 'getTuGap').mockImplementation(() => {
      });

      metaActions.receiveSnakeData(id, data)(dispatchSpy);

      expect(spy).toHaveBeenCalledWith(id, data);
    });

    it('calls dispatch with snakeActions.updateSnakeData with passed id and data', () => {
      jest.spyOn(snakeHelpers, 'getTuGap').mockImplementation(() => (5));
      const updateSpy = jest.spyOn(snakeActions, 'updateSnakeData').mockImplementation(() => {});

      metaActions.receiveSnakeData(id, data)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(snakeActions.updateSnakeData(id, data));
      expect(updateSpy).toHaveBeenCalledWith(id, data);
    });

    it('calls dispatch with headSetActions.updateHeadSets with passed id and gap', () => {
      const gap = 5;
      jest.spyOn(snakeHelpers, 'getTuGap').mockImplementation(() => (gap));
      const spy = jest.spyOn(headSetActions, 'updateHeadSets').mockImplementation(() => {
      });

      metaActions.receiveSnakeData(id, data)(dispatchSpy);
      expect(dispatchSpy).toHaveBeenCalledWith(headSetActions.updateHeadSets(id, null, gap));
      expect(spy).toHaveBeenCalledWith(id, null, gap);
    });
  });

  describe('checkReadiness thunk', () => {
    const dispatchSpy = jest.fn();
    let initialState = {};

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof metaActions.checkReadiness()).toBe('function');
    });

    it('does not call p2pActions.p2pBroadcastGameStatus if gameStatus is not pregame', () => {
      initialState = {
        info: { gameStatus: 'aegknr' },
      };

      const getStateSpy = jest.spyOn(store, 'getState').mockImplementation(() => (initialState));
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastGameStatus');

      metaActions.checkReadiness()(dispatchSpy);

      expect(getStateSpy).toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not call p2pActions.p2pBroadcastGameStatus if snake data is missing', () => {
      initialState = {
        info: { gameStatus: constants.GAME_STATUS_PREGAME },
        p2p: {
          peers: {
            lhiaer: {},
            elgjkn: {},
          },
        },
        snakes: {},
      };

      const getStateSpy = jest.spyOn(store, 'getState').mockImplementation(() => (initialState));
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastGameStatus');

      metaActions.checkReadiness()(dispatchSpy);

      expect(getStateSpy).toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls p2pActions.p2pBroadcastGameStatus with ready-to-play status if all peers\' snake data is present', () => {
      initialState = {
        info: { gameStatus: constants.GAME_STATUS_PREGAME },
        p2p: {
          peers: {
            lhiaer: {},
            elgjkn: {},
          },
        },
        snakes: {
          lhiaer: {},
          elgjkn: {},
        },
      };

      const getStateSpy = jest.spyOn(store, 'getState').mockImplementation(() => (initialState));
      const spy = jest.spyOn(p2pActions, 'p2pBroadcastGameStatus').mockImplementation(() => {
      });

      metaActions.checkReadiness()(dispatchSpy);

      expect(getStateSpy).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(p2pActions.p2pBroadcastGameStatus(constants.GAME_STATUS_READY_TO_PLAY));
      expect(spy).toHaveBeenCalledWith(constants.GAME_STATUS_READY_TO_PLAY);
    });
  });

  describe('resetGameData thunk', () => {
    const dispatchSpy = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('returns a function', () => {
      expect(typeof metaActions.resetGameData()).toBe('function');
    });

    it('calls dispatch with infoActions.resetAvailableRows', () => {
      const spy = jest.spyOn(infoActions, 'resetAvailableRows').mockImplementation(() => {
      });

      metaActions.resetGameData()(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.resetAvailableRows());
    });

    it('calls dispatch with snakeActions.resetSnakeData', () => {
      const spy = jest.spyOn(snakeActions, 'resetSnakeData').mockImplementation(() => {
      });

      metaActions.resetGameData()(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(snakeActions.resetSnakeData());
    });

    it('calls dispatch with boardActions.resetBoard', () => {
      const spy = jest.spyOn(boardActions, 'resetBoard').mockImplementation(() => {
      });

      metaActions.resetGameData()(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(boardActions.resetBoard());
    });

    it('calls dispatch with headSetActions.resetHeadSets', () => {
      const spy = jest.spyOn(headSetActions, 'resetHeadSets').mockImplementation(() => {
      });

      metaActions.resetGameData()(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(headSetActions.resetHeadSets());
    });

    it('calls dispatch with infoActions.setTu', () => {
      const spy = jest.spyOn(infoActions, 'setTu').mockImplementation(() => {
      });

      metaActions.resetGameData()(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.setTu(0));
    });

    it('calls dispatch with infoActions.resetWinner', () => {
      const spy = jest.spyOn(infoActions, 'resetWinner').mockImplementation(() => {
      });

      metaActions.resetGameData()(dispatchSpy);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(infoActions.resetWinner());
    });
  });
});