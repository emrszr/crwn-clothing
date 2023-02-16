import { takeLatest, put, all, call } from "redux-saga/effects";
import {
  createUserDocumentFromAuth,
  getCurrentUser,
} from "../../utils/firebase/firebase.utils";
import { singInFailed, singInSuccess } from "./user.action";
import USER_ACTION_TYPES from "./user.types";

export function* getSnapshotFromUserAuth(userAuth, additionalDetails) {
  try {
    const userSnapshot = yield call(
      createUserDocumentFromAuth,
      userAuth,
      additionalDetails
    );
    yield put(singInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
  } catch (error) {
    yield put(singInFailed(error));
  }
}

export function* isUserAuthenticated() {
  try {
    const userAuth = yield call(getCurrentUser);
    console.log("userAuth", userAuth);
    if (!userAuth) return;
    yield call(getSnapshotFromUserAuth, userAuth);
  } catch (error) {
    yield put(singInFailed(error));
  }
}

export function* onCheckUserSession() {
  yield takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* userSagas() {
  yield all([call(onCheckUserSession)]);
}
