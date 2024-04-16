import {createComponentInstance, setupComponent} from "./component";
import {ShapeFlags} from "../shared/shapeFlags";
import {Fragment, Text} from "./vnode";
import {createAppAPI} from "./createApp";
import {effect} from "../reactivity/effect";

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert
  } = options;

  function render(vnode, container) {
    patch(null, vnode, container, null);
  }

  function patch(n1, n2, container, parentComponent) {
    // 处理组件
    const { type, shapeFlag } = n2;

    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }
  function processText(n1, n2: any, container: any) {
    const {children} = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.appendChild(textNode);
  }
  function processComponent(n1, n2: any, container: any, parentComponent) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(initialVNode: any, container: any, parentComponent) {
    const instance = createComponentInstance(initialVNode, parentComponent)

    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
  }

  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function patchElement(n1, n2, container) {
    const oldProps = n1.props || {};
    const newProps = n2.props || {};

    const el = (n2.el = n1.el);

    patchProps(el, oldProps, newProps);
  }

  function patchProps(el, oldProps, newProps) {
    for (const key in newProps) {
      const prevProp = oldProps[key];
      const nextProp = newProps[key];

      if (prevProp !== nextProp) {
        hostPatchProp(el, key, prevProp, nextProp);
      }
    }
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    const el = (vnode.el = document.createElement(vnode.type));
    const { children, props, shapeFlag } = vnode;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key];

      hostPatchProp(el, key, val);
    }
    // container.append(el)
    hostInsert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  function setupRenderEffect(instance: any, initialVNode, container) {
    effect(() => {
      if (!instance.isMounted) {
        const { proxy } = instance;
        const subTree = (instance.subTree = instance.render.call(proxy));

        patch(null, subTree, container, instance)

        initialVNode.el = subTree.el;

        instance.isMounted = true;
      } else {
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;

        instance.subTree = subTree;

        patch(prevSubTree, subTree, container, instance)
      }
    });
  }

  return {
    render,
    createApp: createAppAPI(render),
  };
}
