const targetMap = new WeakMap()
let activeEffect = null

// 追踪
function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    dep.add(activeEffect)
  }
}

// 触发
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) { return }
  let dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect())
  }
}

// when running an effect
// if product properties are accessed(GET)
// then call `track(product, <properties>)`
// to save this effect

// if product properties are changed(SET)
// then call `trigger(product, <properties>)`
// to run saved effect
// use Proxy and Reflect to automatic track the change of property

// wrap get and set methods inside a handler constant
// define a function reactive

function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      let result = Reflect.get(target, key, receiver)
      track(target, key)
      return result
    },

    set(target, key, value, receiver) {
      let oldValue = target[key]
      let result = Reflect.set(target, key, value, receiver)
      if (oldValue != value) {
        trigger(target, key)
      }
      return result
    }
  }
  return new Proxy(target, handler)
}

// activeEffect & ref

function effect(eff) {
  activeEffect = eff
  activeEffect()
  activeEffect = null
}

// ref
function ref(raw) {
  const r = {
    get value() {
      track(r, 'value')
      return raw
    },
    set value(newVal) {
      if (raw !== newVal) {
        raw = newVal
        trigger(r, 'value')
      }
    },
  }
  return r
}

function computed(getter) {
  // create a reactive reference called result
  let result = ref()
  // run the getter in an effect() which sets the result.value
  effect(() => (result.value = getter()))
  // return the result
  return result
}

// final, our product is now reactive
let product = reactive({ price: 5, quantity: 2}) // return a proxy object which we use as if it's the original object
// takes an inner value and returns a reactive and mutable ref object.
// the ref object has a single property .value that points to the inner value
let salePrice = ref(0) 
let total = 0


effect(() => { total = salePrice.value * product.quantity })
effect(() => { salePrice.value = product.price * 0.9 })

// console.log(total)
console.log(`Before updated total (should be 10) = ${total} salePrice (should be 4.5) = ${salePrice.value}`)

product.quantity = 3

console.log(`After updated total (should be 13.5) = ${total} salePrice (should be 4.5) = ${salePrice.value}`)

product.price = 10
console.log(`After updated total (should be 27) = ${total} salePrice (should be 9) = ${salePrice.value}`)
