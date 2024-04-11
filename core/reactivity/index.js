let currentEffect;

class Dep {
  constructor(val) {
    this.effects = new Set();
    this._val = val;
  }

  get value() {
    this.depend();
    return this._val;
  }

  set value(newVal) {
    this._val = newVal;
    this.notice();
  }

  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }
  notice() {
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

function effectWatch(effect) {
  currentEffect = effect; 
  effect();
  dep.depend();
  currentEffect = null;
}

// const dep = new Dep(10);
// let b;
// effectWatch(() => {
//   b = dep.value + 10;
//   console.log(b);
// });
// dep.value = 20;

const targetMap = new Map();

function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Map();
    depsMap.set(key, dep);
  }
}

function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key);
      dep.depend();
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value);
      dep.notice();
      return result;
    },
  });
}
