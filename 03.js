// 手动模拟 call、apply、bind执行
// call 方法模拟，call方法执行的操作，将函数作用域指向传入的对象
// 核心实现的思路：将函数作为传入对象新的属性，立即执行函数，删除改属性
Function.prototype.myCall (obj) {
  if (typeof this !== 'function') {
    console.error('typeof error');
    return
  }
  const [context, ...args] = [...arguments]
  obj.fn = this || window;
  const result = obj.fn(...args);
  return result;
};

// 手写深拷贝函数
function deepCopy(object) {
  if (!object || typeof object !== "object") return;

  let newObject = Array.isArray(object) ? [] : {};

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      newObject[key] =
        typeof object[key] === "object" ? deepCopy(object[key]) : object[key];
    }
  }

  return newObject;
};