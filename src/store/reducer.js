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
        case actionType.endOnFirstMove:
            return {
                ...state,
                gameStatus: gameStatus.lost,
                movesCount: state.movesCount + 1,
                startTime: action.time,
                endTime: action.time,
                postToServer: false,
                checkIfWin: false
            };
        case actionType.finishGame:
            return {
                ...state,
                gameStatus: gameStatus.lost,
                movesCount: state.movesCount + 1,
                endTime: action.time,
                postToServer: false,
                checkIfWin: false
            };
        case actionType.revealFirstTile:
            return {
                ...state,
                boardData: [...action.board],
                gameStatus: gameStatus.inProgress,
                movesCount: state.movesCount + 1,
                startTime: action.time,
                postToServer: true,
                checkIfWin: false
            };
        case actionType.revealTile:
            return {
                ...state,
                boardData: [...action.board],
                gameStatus: gameStatus.inProgress,
                movesCount: state.movesCount + 1,
                postToServer: true,
                checkIfWin: false
            };
        case actionType.checkIfWin:
            return {
                ...state,
                boardData: [...action.board],
                movesCount: state.movesCount + 1,
                mineCount: action.mineCount,
                postToServer: true,
                checkIfWin: true
            };
        case actionType.flagFirstMove:
            return {
                ...state,
                boardData: [...action.board],
                movesCount: state.movesCount + 1,
                mineCount: action.mineCount,
                startTime: action.time,
                postToServer: true,
                checkIfWin: false
            };
        case actionType.flagTile:
            return {
                ...state,
                boardData: [...action.board],
                movesCount: state.movesCount + 1,
                mineCount: action.mineCount,
                postToServer: true,
                checkIfWin: false
            };
        case actionType.gameWon:
            return {
                ...state,
                gameStatus: gameStatus.won,
                endTime: action.time,
                postToServer: false,
                checkIfWin: false
            };
        case actionType.updateBoard:
            return {
                ...state,
                boardData: [...action.board]
            }
        default:
            return state;

    }

};

export default reducer;