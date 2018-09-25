export const actions = {
    STORE_PENDING: "STORE_PENDING",
    SET_LEVEL: "SET_DIFFICULTY",
    SET_BOARD: "SET_BOARD",
    endOnFirstMove: "END_FIRST",
    finishGame: "FINISH",
    revealFirstTile: "REVEAL_FIRST",
    revealTile: "REVEAL",
    checkIfWin: "CHECK_IF_WIN",
    flagFirstMove: "FLAG_FIRST",
    flagTile: "FLAG",
    gameWon: "WON_GAME",
    updateBoard: "UPDATE_BOARD"
}

export const storePendingGame = (game) => {
    return {
        type: actions.STORE_PENDING,
        pending: game
    }
}

