import {reactive} from 'vue'
import {createStore} from 'vuex'
import {
  RESET_ACTIVE_SQUARE_COORDINATE,
  SET_ACTIVE_SQUARE_COORDINATE,
  SET_FAILED,
  SET_MATRIX,
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

export default createStore({
  state: {
    failed: false,
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
    [SET_MATRIX](state, {matrix}) {
      state.activeSquareCoordinate = {rowIndex: -1, colIndex: -1}
      state.matrix = matrix
      state.failed = false;
    },
    [SET_FAILED](state) {
      state.activeSquareCoordinate = {rowIndex: -1, colIndex: -1}
      state.failed = true;
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

      commit(RESET_ACTIVE_SQUARE_COORDINATE)
    },
    [SQUARE_MOUSE_UP_RIGHT]({commit, state}, {coordinate, isRecursive}) {
      if ((coordinate.rowIndex !== state.activeSquareCoordinate.rowIndex || coordinate.colIndex !== state.activeSquareCoordinate.colIndex) && !isRecursive) {
        commit(RESET_ACTIVE_SQUARE_COORDINATE)
        return
      }

      state.matrix[coordinate.rowIndex][coordinate.colIndex].mark()

      commit(RESET_ACTIVE_SQUARE_COORDINATE)
    },
    [SQUARE_MOUSE_LEAVE]({commit, state}, {coordinate}) {
      if (coordinate.rowIndex === state.activeSquareCoordinate.rowIndex || coordinate.colIndex === state.activeSquareCoordinate.colIndex) {
        commit(RESET_ACTIVE_SQUARE_COORDINATE)
        return
      }
    },
    [INIT_MATRIX]({commit}, {rowsLength, colsLength, bombsCount}) {
      if (rowsLength < 9 || colsLength < 9 || bombsCount >= rowsLength * colsLength) {
        throw 'INIT_MATRIX error'
      }
      const squaresCount = rowsLength * colsLength

      let tempArr = [];
      for (let i = 0; i < squaresCount; i++) {
        tempArr.push({
          status: SquareStatus.closed,
          type: bombsCount-- > 0 ? SquareType.bomb : SquareType.normal,
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

      commit(SET_MATRIX, {matrix})
    },
  },
  modules: {}
})
