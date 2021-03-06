import * as infoHelpers from './infoHelpers';
import * as actionTypes from '../actionTypes';
import * as constants from '../../constants';

export const defaultState = {
  tu: constants.INITIAL_TU,
  gameStatus: constants.GAME_STATUS_LOBBY,
  availableRows: infoHelpers.getShuffledAvailableRows(),
  ownStartingRow: null,
  livingSnakeCount: 0,
  winner: '',
  deathBuffer: {},
  gameOverBuffer: {},
};

export default function infoReducer(state = defaultState, action) {
  switch (action.type) {
    case actionTypes.INCREMENT_TU: {
      const newState = { ...state };
      newState.tu += 1;
      return newState;
    }
    case actionTypes.RESET_TU: {
      const newState = { ...state };
      newState.tu = 0;
      return newState;
    }
    case actionTypes.UPDATE_GAME_STATUS: {
      if (state.gameStatus === action.status) {
        return state;
      }

      const newState = { ...state };
      newState.gameStatus = action.status;

      return newState;
    }
    case actionTypes.UPDATE_OWN_STARTING_ROW: {
      if (state.ownStartingRow !== null) {
        return state;
      }

      const newState = { ...state };
      newState.ownStartingRow = action.startingRow;
      return newState;
    }
    case actionTypes.RESET_OWN_STARTING_ROW: {
      const newState = { ...state };
      newState.ownStartingRow = null;
      return newState;
    }
    case actionTypes.UPDATE_AVAILABLE_ROWS: {
      const newState = { ...state };
      newState.availableRows = action.availableRows;
      return newState;
    }
    case actionTypes.RESET_AVAILABLE_ROWS: {
      const newState = { ...state };
      newState.availableRows = infoHelpers.getShuffledAvailableRows();
      return newState;
    }
    case actionTypes.UPDATE_WINNER: {
      // don't overwrite if no change
      if (state.winner === action.winner) {
        return state;
      }

      const newState = { ...state };
      newState.winner = action.winner;
      return newState;
    }
    case actionTypes.RESET_WINNER: {
      const newState = { ...state };
      newState.winner = '';
      return newState;
    }
    case actionTypes.SET_LIVING_SNAKE_COUNT: {
      const newState = { ...state };
      newState.livingSnakeCount = action.count;
      return newState;
    }
    case actionTypes.DECREMENT_LIVING_SNAKE_COUNT: {
      const newState = { ...state };
      newState.livingSnakeCount -= 1;
      return newState;
    }
    case actionTypes.RESET_LIVING_SNAKE_COUNT: {
      const newState = { ...state };
      newState.livingSnakeCount = 0;
      return newState;
    }
    case actionTypes.ADD_TO_DEATH_BUFFER: {
      const newState = { ...state };
      if (newState.deathBuffer[action.tu]) {
        // increment
        newState.deathBuffer[action.tu] += 1;
      } else {
        // initialize to 1
        newState.deathBuffer[action.tu] = 1;
      }
      return newState;
    }
    case actionTypes.REMOVE_FROM_DEATH_BUFFER: {
      const newState = { ...state };
      delete newState.deathBuffer[action.tu];
      return newState;
    }
    case actionTypes.RESET_DEATH_BUFFER: {
      const newState = { ...state };
      newState.deathBuffer = {};
      return newState;
    }
    case actionTypes.ADD_TO_GAME_OVER_BUFFER: {
      const newState = { ...state };
      newState.gameOverBuffer[action.tu] = true;
      return newState;
    }
    case actionTypes.RESET_GAME_OVER_BUFFER: {
      const newState = { ...state };
      newState.gameOverBuffer = {};
      return newState;
    }
    default: {
      return state;
    }
  }
}
