// 实现数组扁平化
// 多种实现的思路
// 1、递归实现
function flatten (array = []) {
  let resArr = []
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    if (Array.isArray(item)) {
      resArr = resArr.concat(flatten(item));
    } else {
      resArr.push(item);
    }
  }
  return resArr;
}

// 2、拓展云算符
// 3、es6 flat
function flatten_03 (array = []) {
  return array.flat(Infinity);
}

// 实现数组去重
// 用 new Set() 方法

// 思考，大数+ - * / 效果

// 实现 add(1)(2)(3)
// 最简单版本
function add(a) {
  return function (b) {
    return function (c) {
      return a+b+c;
    }
  }
}

// 进阶版本：函数柯里化
// 函数柯里化概念： 柯里化（Currying）是把接受多个参数的函数转变为接受一个单一参数的函数，
// 并且返回接受余下的参数且返回结果的新函数的技术。
var add = function (m) {
  var temp = function (n) {
    return add(m + n);
  }
  temp.toString = function () {
    return m;
  }
  return temp;
};
console.log(add(3)(4)(5)); // 12
console.log(add(3)(6)(9)(25)); // 43

// 将 js 对象转化为树形结构
// 转换前：
const source = [{
  id: 1,
  pid: 0,
  name: 'body'
}, {
  id: 2,
  pid: 1,
  name: 'title'
}, {
  id: 3,
  pid: 2,
  name: 'div'
}];
// 转换后
const tree = [{
  id: 1,
  pid: 0,
  name: 'body',
  children: [{
    id: 2,
    pid: 1,
    name: 'title',
    children: [{
      id: 3,
      pid: 1,
      name: 'div'
    }]
  }]
}];
function jsonToTree(data) {
  // 初始化结果数组，并判断输入数据的格式
  let result = []
  if(!Array.isArray(data)) {
    return result
  }
  // 使用map，将当前对象的id与当前对象对应存储起来
  let map = {};
  data.forEach(item => {
    map[item.id] = item;
  });
  // 
  data.forEach(item => {
    let parent = map[item.pid];
    if(parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}
