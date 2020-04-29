import logger from 'redux-logger'
import { createStore, applyMiddleware, compose } from 'redux'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = []

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger)
}

export default composeEnhancers(applyMiddleware(...middlewares))(createStore)