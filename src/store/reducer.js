import { actions as actionType } from './actions/actions';

import { gameStatus } from '../Containers/Pages/Play/gameStatus';

const initialState = {
    boardData: null,
    difficulty: null,
    gameStatus: null,
    height: null,
    width: null,
    startTime: null,
    endTime: null,
    mineCount: null,
    movesCount: null,
    postToServer: false,
    checkIfWin: false
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.STORE_PENDING:
            return {
                ...state,
                boardData: [...action.pending.boardData],
                difficulty: action.pending.difficulty,
                gameStatus: action.pending.status,
                height: action.pending.height,
                width: action.pending.width,
                startTime: action.pending.startTime,
                mineCount: action.pending.mineCount,
                movesCount: action.pending.movesCount
            };
        case actionType.SET_LEVEL:
            return {
                ...state,
                difficulty: action.difficulty,
                height: action.height,
                width: action.width,
                mineCount: action.mineCount,
                movesCount: 0,
                gameStatus: gameStatus.notInitialized,
                postToServer: false,
                checkIfWin: false
            };
        case actionType.SET_BOARD:
            return {
                ...state,
                boardData: [...action.board],
                postToServer: false,
                checkIfWin: false
            };
        case actionType.END_ON_FIRST_MOVE:
            return {
                ...state,
                gameStatus: gameStatus.lost,
                movesCount: state.movesCount + 1,
                startTime: action.time,
                endTime: action.time,
                postToServer: false,
                checkIfWin: false
            };
        case actionType.FINISH_GAME:
            return {
                ...state,
                gameStatus: gameStatus.lost,
                movesCount: state.movesCount + 1,
                endTime: action.time,
                postToServer: false,
                checkIfWin: false
            };
        case actionType.REVEAL_FIRST_TILE:
            return {
                ...state,
                boardData: [...action.board],
                gameStatus: gameStatus.inProgress,
                movesCount: state.movesCount + 1,
                startTime: action.time,
                postToServer: true,
                checkIfWin: false
            };
        case actionType.REVEAL_TILE:
            return {
                ...state,
                boardData: [...action.board],
                gameStatus: gameStatus.inProgress,
                movesCount: state.movesCount + 1,
                postToServer: true,
                checkIfWin: false
            };
        case actionType.FLAG_AND_CHECK:
            return {
                ...state,
                boardData: [...action.board],
                movesCount: state.movesCount + 1,
                mineCount: action.mineCount,
                postToServer: true,
                checkIfWin: true
            };
        case actionType.FLAG_FIRST_MOVE:
            return {
                ...state,
                boardData: [...action.board],
                movesCount: state.movesCount + 1,
                mineCount: action.mineCount,
                startTime: action.time,
                postToServer: true,
                checkIfWin: false
            };
        case actionType.FLAG_TILE:
            return {
                ...state,
                boardData: [...action.board],
                movesCount: state.movesCount + 1,
                mineCount: action.mineCount,
                postToServer: true,
                checkIfWin: false
            };
        case actionType.GAME_WON:
            return {
                ...state,
                gameStatus: gameStatus.won,
                endTime: action.time,
                postToServer: false,
                checkIfWin: false
            };
        case actionType.UPDATE_BOARD:
            return {
                ...state,
                boardData: [...action.board]
            }
        default:
            return state;

    }

};

export default reducer;