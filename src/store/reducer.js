import {actions as actionType} from './actions';
import { gameStatus } from '../Containers/Pages/Play/gameStatus';
const initialState = {
    boardData: null,
    difficulty: null,
    finished: false,
    gameStatus: null,
    height: null,
    width: null,
    startTime: null,
    endTime: null,
    mineCount: null,
    movesCount: null,
}


const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionType.storePendingGame:
            return ({
                ...state,
                boardData: [...action.pending.boardData],
                difficulty: action.pending.difficulty,
                gameStatus: action.pending.gameStatus,
                height: action.pending.height,
                width: action.pending.width,
                startTime: action.pending.startTime,
                mineCount:action.pending.mineCount,
                movesCount: action.pending.movesCount
            });
        case actionType.erasePendingGame:
            return ({
                ...state,
                pendingGame: null
            });
        case actionType.setLevel:
            return({
                ...state,
                difficulty: action.difficulty,
                height: action.height,
                width: action.width,
                mineCount:action.mineCount,
                movesCount:0,
                gameStatus:gameStatus.notInitialized ,
            });
        case actionType.setBoard:
            return({
                ...state,
                boardData: [...action.board]
            })
        default:
            return state;

    }

};

export default reducer;