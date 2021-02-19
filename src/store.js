// Credit: https://github.com/dprovodnikov/complex-redux-project-architecture

import {combineReducers, createStore, applyMiddleware} from "redux";
import thunkMiddleware from "redux-thunk";
import {createLogger} from "redux-logger";

const configureStore = (reducers) => {
	const logger = createLogger();
	const rootReducer = combineReducers(reducers);
	const middleware = applyMiddleware(thunkMiddleware, logger);

	return createStore(rootReducer, middleware);
};

export default configureStore;
