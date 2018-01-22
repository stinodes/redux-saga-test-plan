import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { expectSaga } from '../../src';

const initialState = {
  name: 'Tucker',
  age: 11,
};

function dogReducer(state = initialState, action) {
  if (action.type === 'HAVE_BIRTHDAY') {
    return {
      ...state,
      age: state.age + 1,
    };
  }
  if (action.type === 'DOG') {
    return action.payload;
  }

  return state;
}

function getDog(state) {
  return state.dog;
}

function* saga() {
  const dog = yield select(getDog);
  yield put({ type: 'DOG', payload: dog });
  yield put({ type: 'HAVE_BIRTHDAY' });
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(dogReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(saga);

it('works with redux stores', () => {
  const expect = expectSaga(saga).withStore(store);

  expect.put({ type: 'DOG', payload: initialState.dog });
  expect.put({ type: 'HAVE_BIRTHDAY' });
  expect.hasFinalState({
    name: 'Tucker',
    age: 12,
  });

  return expect.run();

  // expectSaga(saga)
  //   .withStore(store)
  //   .put({ type: 'DOG', payload: initialState.dog })
  //   .run();
});
