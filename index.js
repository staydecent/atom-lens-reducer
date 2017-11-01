import check from 'check-arg-types'

import rPath from 'ramda/src/path'
import merge from 'ramda/src/merge'
import pick from 'ramda/src/pick'
import curryN from 'ramda/src/curryN'
import pipe from 'ramda/src/pipe'
import dissocPath from 'ramda/src/dissocPath'
import lensPath from 'ramda/src/lensPath'
import lensSet from 'ramda/src/set'
import view from 'ramda/src/view'
import over from 'ramda/src/over'

const toType = check.prototype.toType

// Small util to create Flux Standard Actions
// https://github.com/acdlite/flux-standard-action
export const createAction = curryN(2, function (type, payload, extra) {
  check(arguments, ['string', '-any', ['object', 'undefined']])
  let action = {type, payload}
  if (extra) {
    return merge(action, {extra: pick(['meta', 'error'], extra)})
  }
  return action
})

// Actions

const ATOM_SET = 'ATOM_SET'
export const set = (path, value, extra = {}) => {
  const metaType = rPath(['meta', 'type'], extra)
  return createAction(
    `${ATOM_SET}${metaType ? `:${metaType}` : ''}`,
    {path: toType(path) === 'array' ? path : [path], value},
    extra
  )
}

const ATOM_UPDATE = 'ATOM_UPDATE'
export const update = (path, value, extra = {}) => {
  const metaType = rPath(['meta', 'type'], extra)
  return createAction(
    `${ATOM_UPDATE}${metaType ? `:${metaType}` : ''}`,
    {path: toType(path) === 'array' ? path : [path], value},
    extra
  )
}

const ATOM_REMOVE = 'ATOM_REMOVE'
export const remove = (path, extra = {}) => {
  const metaType = rPath(['meta', 'type'], extra)
  return createAction(
    `${ATOM_REMOVE}${metaType ? `:${metaType}` : ''}`,
    {path: toType(path) === 'array' ? path : [path]},
    extra
  )
}

// Reducers

const atomSetReducer = ({path, value}, state) => {
  const lens = lensPath(path)
  return lensSet(lens, value, state)
}

const atomUpdateReducer = ({path, value}, state) => {
  const lens = lensPath(path)
  const currentType = pipe(over(lens, toType), view(lens))(state)
  const newType = toType(value)

  if (currentType === newType) {
    if (newType === 'array') {
      return over(lens, (v) => v.concat(value), state)
    }
    if (newType === 'object') {
      return over(lens, (v) => merge(v, value), state)
    }
  }

  return lensSet(lens, value, state)
}

const atomRemoveReducer = ({path}, state) =>
  dissocPath(path, state)

export const reducer = ({type, payload}, state) => {
  if (type.indexOf(ATOM_SET) === 0)
      return atomSetReducer(payload, state)

  if (type.indexOf(ATOM_UPDATE) === 0)
      return atomUpdateReducer(payload, state)

  if (type.indexOf(ATOM_REMOVE) === 0)
      return atomRemoveReducer(payload, state)

  return state
}
