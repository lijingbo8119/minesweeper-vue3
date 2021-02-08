import {reactive} from 'vue'
import {createStore} from 'vuex'
import {
  RESET_ACTIVE_SQUARE_COORDINATE,
  SET_ACTIVE_SQUARE_COORDINATE,
  SET_FAILED,
  SET_MATRIX,
  SET_SUCCEED,
  INIT_START_TIMESTAMP,
} from "@/store/mutation-types";
import {
  INIT_MATRIX,
  SQUARE_MOUSE_DOWN_LEFT,
  SQUARE_MOUSE_DOWN_RIGHT,
  SQUARE_MOUSE_LEAVE,
  SQUARE_MOUSE_UP_LEFT,
  SQUARE_MOUSE_UP_RIGHT,
} from "@/store/action-types";
import * as _ from 'lodash'
import {Coordinate} from "@/model/interface";
import {Square, SquareStatus, SquareType} from "@/model/square";
import {getMatrixStatus} from "@/model/matrix";

export default createStore({
  state: {
    failed: false,
    succeed: false,
    bombsCount: 0,
    markedCount: 0,

    startTimestamp: 0,
    endTimestamp: 0,
    duration: 0,
    durationTimerId: 0,

    activeSquareCoordinate: {
      rowIndex: -1,
      colIndex: -1,
    } as Coordinate,

    matrix: [] as Array<Array<Square>>,
  },
  mutations: {
    [RESET_ACTIVE_SQUARE_COORDINATE](state) {
      state.activeSquareCoordinate = {rowIndex: -1, colIndex: -1}
    },
    [SET_ACTIVE_SQUARE_COORDINATE](state, {coordinate}) {
      state.activeSquareCoordinate = coordinate
    },
    [SET_MATRIX](state, {matrix, bombsCount}) {
      state.activeSquareCoordinate = {rowIndex: -1, colIndex: -1}
      state.matrix = matrix
      state.succeed = false;
      state.failed = false;
      state.startTimestamp = 0;
      state.endTimestamp = 0;
      state.duration = 0;
      state.bombsCount = bombsCount;
      state.markedCount = 0;
    },
    [SET_FAILED](state) {
      state.activeSquareCoordinate = {rowIndex: -1, colIndex: -1}
      state.failed = true;
      state.endTimestamp = Date.parse(new Date().toString());
      clearInterval(state.durationTimerId)
    },
    [SET_SUCCEED](state) {
      state.activeSquareCoordinate = {rowIndex: -1, colIndex: -1}
      state.succeed = true;
      state.endTimestamp = Date.parse(new Date().toString());
      clearInterval(state.durationTimerId)
    },
    [INIT_START_TIMESTAMP](state) {
      if (state.startTimestamp) {
        return;
      }
      state.startTimestamp = Date.parse(new Date().toString());
      state.durationTimerId = setInterval(() => state.duration = (Date.parse(new Date().toString()) - state.startTimestamp) / 1000, 200)
    },
  },
  actions: {
    [SQUARE_MOUSE_DOWN_LEFT]({commit}, {coordinate}) {
      commit(SET_ACTIVE_SQUARE_COORDINATE, {coordinate})
    },
    [SQUARE_MOUSE_DOWN_RIGHT]({commit}, {coordinate}) {
      commit(SET_ACTIVE_SQUARE_COORDINATE, {coordinate})
    },
    [SQUARE_MOUSE_UP_LEFT]({commit, state}, {coordinate, isRecursive}) {
      if ((coordinate.rowIndex !== state.activeSquareCoordinate.rowIndex || coordinate.colIndex !== state.activeSquareCoordinate.colIndex) && !isRecursive) {
        commit(RESET_ACTIVE_SQUARE_COORDINATE)
        return
      }

      state.matrix[coordinate.rowIndex][coordinate.colIndex].open(state.matrix)
      if (state.matrix[coordinate.rowIndex][coordinate.colIndex].getStatus() === SquareStatus.exploded) {
        commit(SET_FAILED)
        return;
      }

      const status = getMatrixStatus(state.matrix)
      state.markedCount = status.markedSquaresCount + status.markedBombsCount;

      status.succeed ? commit(SET_SUCCEED) : null;
      commit(INIT_START_TIMESTAMP)
      commit(RESET_ACTIVE_SQUARE_COORDINATE)
    },
    [SQUARE_MOUSE_UP_RIGHT]({commit, state}, {coordinate, isRecursive}) {
      if ((coordinate.rowIndex !== state.activeSquareCoordinate.rowIndex || coordinate.colIndex !== state.activeSquareCoordinate.colIndex) && !isRecursive) {
        commit(RESET_ACTIVE_SQUARE_COORDINATE)
        return
      }

      state.matrix[coordinate.rowIndex][coordinate.colIndex].mark()

      const status = getMatrixStatus(state.matrix)
      state.markedCount = status.markedSquaresCount + status.markedBombsCount;

      status.succeed ? commit(SET_SUCCEED) : null;
      commit(INIT_START_TIMESTAMP)
      commit(RESET_ACTIVE_SQUARE_COORDINATE)
    },
    [SQUARE_MOUSE_LEAVE]({commit, state}, {coordinate}) {
      if (coordinate.rowIndex === state.activeSquareCoordinate.rowIndex || coordinate.colIndex === state.activeSquareCoordinate.colIndex) {
        commit(RESET_ACTIVE_SQUARE_COORDINATE)
        return
      }
    },
    [INIT_MATRIX]({commit}, {rowsLength, colsLength, bombsCount}) {
      let _bombsCount = bombsCount;
      if (rowsLength < 9 || colsLength < 9 || bombsCount >= rowsLength * colsLength) {
        throw 'INIT_MATRIX error'
      }
      const squaresCount = rowsLength * colsLength

      let tempArr = [];
      for (let i = 0; i < squaresCount; i++) {
        tempArr.push({
          status: SquareStatus.closed,
          type: _bombsCount-- > 0 ? SquareType.bomb : SquareType.normal,
        });
      }
      tempArr = _.shuffle(tempArr)

      const matrix = reactive([] as Array<Array<Square>>);
      for (let i = 0; i < rowsLength; i++) {
        matrix.push(reactive([] as Array<Square>));

        for (let j = 0; j < colsLength; j++) {
          const temp = tempArr.pop()

          const coordinate = {rowIndex: i, colIndex: j} as Coordinate
          const type = temp?.type as SquareType
          const status = temp?.status as SquareStatus

          matrix[i].push(new Square({coordinate, type, status}))
        }
      }

      commit(SET_MATRIX, {matrix, bombsCount})
    },
  },
  getters: {},
  modules: {}
})
