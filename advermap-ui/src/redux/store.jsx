import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { default as notificationReducer } from "./notification";
import appSlice from "./appSlice";
import spaceSlice from "./spaceSlice";
import surfaceSlice from "./surfaceSlice";
import reportSlice from "./reportSlice";
import permission from "./permission";
import spaceRequestSlice from "./spaceRequestSlice";
import userSlice from "./userSlice";
import navSlice from "./navSlice";
import surfaceRequestSlice from "./surfaceRequestSlice";

const persistConfig = {
  key: "root", // Change this key as needed
  storage,
};

const rootReducer = combineReducers({
  appState: appSlice,
  notification: notificationReducer,
  spaces: spaceSlice,
  spaceRequest: spaceRequestSlice,
  surfaces: surfaceSlice,
  surfaceRequest: surfaceRequestSlice,
  nav: navSlice,
  reports: reportSlice,
  permission: permission,
  users: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
