/**
 * @desc 虚拟 DOM 渲染器 renderer
 */
const vnode = {
  tag: 'div',
  props: {
    onClick: () => {alert('hello')}
  },
  children: 'click me'
}

function renderer(vnode, container) {
  // 判断vnode类型
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container)
  } else if (typeof vnode.tag === 'function') {
    mountComponent(vnode, container)
  }
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)

  for(const key in vnode.props) {
    if (/^on/.test(key)) {
      el.addEventListener(
        key.substr(2).toLowerCase(),
        vnode.props[key]
      )
    }
  }

  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }

  container.appendChild(el)
}

// 为了渲染组件，tag属性有可能返回的是虚拟DOM
function mountComponent(vnode, container) {
  const subtree = vnode.tag()
  renderer(subtree, container)
}

renderer(vnode, document.getElementById('app'))

export function mountElement(vnode, container) {
  const { tag, props, children } = vnode;
  const el = document.createElement(tag);

  if (props) {
    for (const key in props) {
      const val = props[key];
      el.setAttribute(key, val);
    }
  }

  // children
  if (typeof children === "string") {
    const textNode = document.createTextNode(children);
    el.append(textNode);
  } else if (Array.isArray(children)) {
    children.forEach((v) => {
      mountElement(v, el);
    });
  }
}

export function diff(n1, n2) {
  if (n1.tag !== n2.tag) {
    n1.el.replaceWith(document.createElement(n2.tag));
  } else {
    n2.el = n1.el;
    const { props: newProps } = n2;
    const { props: oldProps } = n1;

    if (newProps && oldProps) {
      Object.keys(newProps).forEach((key) => {
        const newVal = newProps[key];
        const oldVal = oldProps[key];

        if (newVal !== oldVal) {
          n1.el.setAttribute(key, newVal);
        }
      });
    }

    if (oldProps) {
      Object.keys(oldProps).forEach((key) => {
        if (!newProps[key]) {
          n1.el.removeAttribute(key);
        }
      });
    }
  }

  const { children: newChildren = [] } = n2;
  const { children: oldChildren = [] } = n1;
  if (typeof newChildren === "string") {
    if (typeof oldChildren === "string") {
      if (newChildren !== oldChildren) {
        n2.textContent = newChildren;
      }
    } else if (Array.isArray(oldChildren)) {
      n2.textContent = oldChildren;
    }
  } else if (Array.isArray(newChildren)) {
    if (typeof oldChildren === "string") {
      n2.el.innerText = ``;
      mountElement(n2, n2.el);
    } else if (Array.isArray(oldChildren)) {
      const length = Math.min(newChildren);
      for (let index = 0; index < length; index++) {
        const newVNode = newChildren[index];
        const oldVNode = oldChildren[index];
        diff(oldVNode, newVNode);
      }

      if (newChildren.length > length) {
        for (let index = length; index < newChildren.length; index++) {
          const newVNode = newChildren[index];
          mountElement(newVNode);
        }
      }

      if (oldChildren.length > length) {
        for (let index = length; index < oldChildren.length; index++) {
          const oldVNode = oldChildren[index];
          oldVNode.el.parent.removeChild(oldVNode.el);
        }
      }
    }
  }
}