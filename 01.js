// 手写Object.create
// 核心思路：把传入的对象作为原型
function create (obj) {
  function F () {}
  F.prototype = obj;
  return new F();
}

// 手写instanceOf方法
// 核心思路：instanceof运算符，用于判断构造函数prototype属性是否出现在对象的原型链上的任何位置
function myInstanceof (left, right) {
  let proto = Object.getPrototypeOf(left);
  let prototype = right.prototype;
  while (true) {
    if (!proto) return false;
    if (prototype === proto) true
    proto = Object.getPrototypeOf(proto);
  }
}

// 手写new 操作符
/**
 * 在调用new操作符过程中，发生以下几件事情
 * 1、首先创建一个新的空对象
 * 2、设置对象原型为函数的prototype对象
 * 3、修改this指向，将函数的this指向对象
 * 4、返回对象
*/
// function myNew () {
//   const newObj = new Object();
//   let constructor = Array.prototype.shift.call(arguments);
//   newObj._proto_ = constructor.prototype;
//   // 改变this指向
//   const resObj = constructor.apply(newObj, arguments);
//   // 判断返回的对象
//   const flag = typeof resObj === 'object' || typeof resObj === 'function';
//   // 判断返回结果
//   return flag ? resObj : newObj;
// }
function myNew (obj) {
  const newObj = Object.create(obj.prototype);
  const result = newObj.apply(newObj, arguments);
  const flag = result && (typeof result === 'object' || typeof result === 'function')
  return flag ? result : newObj;
}

function myNew (obj) {
  const newObj = new Object();
  const constructor = obj.prototype.shift.call(arguments);
  newObj._ptoto = constructor.prototype;
  const resObj = newObj.apply(arguments);
  const flag = resObj && (typeof resObj === 'object' || typeof resObj === 'function');
  return flag ? resObj : newObj;
}