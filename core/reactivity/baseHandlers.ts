import {reactive, ReactiveFlags, readonly} from './reactive'
import {track, trigger} from "./effect"
import {extend, isObject} from "../shared";

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)

    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    // 收集依赖
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter(readonly = false) {
  return function set(target, key, value) {
    if (!readonly) {
      const res = Reflect.set(target, key, value)
      // 触发依赖
      trigger(target, key)
      return res
    }
  }
}

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: function (target, key, value) {
    console.warn(`key: ${key} set 失败，因为 ${target} 是 readonly`)
    return true
  }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
