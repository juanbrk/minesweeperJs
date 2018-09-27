import {actions} from './actions';

export const storePendingGame = (game) => {
    return {
        type: actions.STORE_PENDING,
        pending: game
    }
}

export const setLevel = (level, height, width, mines) => {
    return {
        type: actions.SET_LEVEL,
        difficulty: level,
        height: height,
        width: width,
        mineCount: mines
    }
}

export const initializeBoard = (data) => {
    return {type: actions.SET_BOARD, board: data}
}

export const endOnFirstMove = (dateTime) =>{
    return { type: actions.END_ON_FIRST_MOVE, time: dateTime }
} 

export const finishGame = (timeEnded) =>{
    return { type: actions.FINISH_GAME, time: timeEnded }
}

export const revealFirstTile = (data, dateTime) => {
    return { type: actions.REVEAL_FIRST_TILE, board: data, time: dateTime }
}

export const revealTile = (data) => {
    return { type: actions.REVEAL_TILE, board: data }
}

export const checkIfWin = (data, mines) => {
    return { type: actions.FLAG_AND_CHECK, board: data, mineCount: mines }
}

export const flagOnFirstMove = (data, mines, dateTime) => {
    return { type: actions.FLAG_FIRST_MOVE, board: data, mineCount: mines, time: dateTime }
}

export const flagTile = (data, mines) => {
    return { type: actions.FLAG_TILE, board: data, mineCount: mines }
}

export const gameWon = (endTime) => {
    return { type: actions.GAME_WON, time: endTime }
}

export const updateBoard = (data) => {
    return {type: actions.UPDATE_BOARD, board: data }
}

