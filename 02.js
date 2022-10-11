// 手写promise
// 1、基础的 Promise 包括的方法，onresolve、onreject 方法、peddnig、fulfilled、rejected方法
// 2、支持then方法，then方法支持链式调用、处理定时调用, 
// then方法本身就返回新的promise对象，并且上一次then执行返回的值，影响下一次then执行
// 3、all、race方法调用，all 方法是当所有的promise执行成功才返回，race 方法是返回最快得到结果的promise无论成功或者失败
class myPromise {
  constructor (cb) {
    // resolve reject 永远指向当前的myPromise的实例，为了防止函数执行环境改变而改变
    // 初始化值
    this.initState();
    // 初始化this指向
    this.initBind();
    // 执行传递进来的函数
    try {
      cb(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  initBind () {
    // 初始化this
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  initValue () {
    this.PromiseResult = null; // 返回值
    this.PromiseState = 'pedding'; // 状态
    this.onFulfilledCbs = [];
    this.onRejectedCbs = []; 
  }
  resolve (value) {
    // 如果执行resolve,状态变成fulfilled
    if (this.PromiseState !== 'pedding')  return
    this.PromiseState = 'fulfilled';
    this.PromiseResult = value;
    while (this.onFulfilledCbs.length) {
      this.onFulfilledCbs.shift()(this.PromiseResult);
    }
  }
  reject (reason) {
    // 如果执行reject,状态变成rejected
    if (this.PromiseState !== 'pedding') return
    this.PromiseState = 'rejected';
    this.PromiseResult = reason;
    while (this.onRejected.length) {
      this.onRejected.shift()(this.PromiseResult);
    }
  }
  then (onFulfilled, onRejected) {
    // 对参数校验，确保一定是函数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : val => val;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

    var thenPromise = new MyPromise((resolve, reject) => {

      const resolvePromise = cb => {
        try {
            const x = cb(this.PromiseResult)
            if (x === thenPromise) {
                // 不能返回自身哦
                throw new Error('不能返回自身。。。')
            }
            if (x instanceof MyPromise) {
                // 如果返回值是Promise
                // 如果返回值是promise对象，返回值为成功，新promise就是成功
                // 如果返回值是promise对象，返回值为失败，新promise就是失败
                // 谁知道返回的promise是失败成功？只有then知道
                x.then(resolve, reject)
            } else {
                // 非Promise就直接成功
                resolve(x)
            }
        } catch (err) {
            // 处理报错
            reject(err)
            throw new Error(err)
        }
      }

      if (this.PromiseState === 'fulfilled') {
        // 如果当前为成功状态，执行第一个回调
        resolvePromise(onFulfilled)
      } else if (this.PromiseState === 'rejected') {
        // 如果当前为失败状态，执行第二个回调
        resolvePromise(onRejected)
      } else if (this.PromiseState === 'pending') {
        // 如果状态为待定状态，暂时保存两个回调
        // 如果状态为待定状态，暂时保存两个回调
        this.onFulfilledCallbacks.push(resolvePromise.bind(this, onFulfilled))
        this.onRejectedCallbacks.push(resolvePromise.bind(this, onRejected))
      }
    })
    // 返回这个包装的Promise
    return thenPromise
    // if (this.PromiseState === 'fulfilled') {
    //   onFulfilled(this.PromiseResult);
    // }
    // if (this.PromiseState === 'rejected') {
    //   onRejected(this.PromiseResult);
    // }
    // if (this.PromiseState === 'pedding') {
    //   // 支持定时器情况处理
    //   this.onFulfilledCbs.push(onFulfilled.bind(this));
    //   this.onRejectedCbs.push(onRejected.bind(this));
    // }
  }
  // TODO: 可以优化点，判断promise的类型
  static all (promises) {
    const result = [];
    let count = 0;
    return new MyPromise((resolve, reject) => {
      const addCount = (index, resValue) => {
        result[index] = resValue;
        count++;
        if (count === promises.length) resolve(result);
      }
      promises.map((promise, index) => {
        promise.then((resolve) => {
          addCount(index, resolve);
        }, (reject) => {
          addCount(index, reject);
        });
      });
    });
  }
  static race (promises) {
    return new MyPromise((resolve, reject) => {
      promises.map((promise) => {
        promise.then((res) => {
          resolve(res);
        }, rej => {
          reject(rej);
        });
      });
    });
  }
}


// 防抖，节流
// 关于防抖，事件触发n秒之后再回调，考虑传入的参数，this的指向
// 防抖动进阶版，立即执行，最后一次执行
function debounce (fn, wait) {
  let timer = null;
  return function () {
    let context = this;
    let ars = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, arguments);
    }, wait);
  }
}
// 防抖立即执行，加上 immediate
function debounce_1 (fn, wait, immediate) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (!timer) {
        fn.apply(context, args);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
  }
}

// 防抖思考返回值，加上取消的操作
function debonce_2 (fn, wait, immediate) {
  const debonced = null;
  const timer = null;
  debonced = function () {
    const context = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    if (immediate) {
      timer = setTimeout(() => {
        timer = null; 
      }, wait);
      if (!timer) {
        fn.apply(context, args);
      }
    } else {
      setTimeout(() => {
        fn.apply(context, arguments);
      }, wait);
    }
  }
  debonced.cancel = function () {
    clearTimeout(timer);
    timer = null;
  }
  return debonced;
}

// 节流，用于例如scroll事件，规定单位时间内，只执行一次，
// 节流有两种实现的方法，时间戳 或者是 定时器，
// 时间戳的好处是，立即执行
// 定时器的好处是，在间隔的时间范围内固定执行一次，最后一次也会稳定执行
// 用时间戳来执行
function throttle (fn, wait) {
  const timer = null;
  let preTime = 0;
  return function () {
    const context = this;
    const args = arguments;
    const nowTime = new Date().getTime();
    if (nowTime - preTime > wait) {
      fn.apply(context, args);
      preTime = nowTime;
    }
  }
}

// 定时器来执行
function throttle_1 (fn, wait) {
  const timer = null;
  return function () {
    const context = this;
    const args = arguments;
    if (!timer) {
      timer = setTimeout(function() {
        timer = null;
        fn.apply(context, args);
      }, wait);
    }
  }
}

// 终极实现
function throttle_2 (fn, wait) {
  const timer = null;
  let preTime = 0;
  return function () {
    const context = this;
    const args = arguments;
    const nowTime = new Date();
    const remaining = wait - (nowTime - preTime);
    // 如果无剩余时间或者修改系统时间，立即执行一次
    if (remaining <= 0 || remaining > wait ) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      preTime = nowTime;
      fn.apply(context, args);
    } else if (!timer){
      timer = setTimeout(() => {
        timer = null;
        preTime = new Date();
        fn(apply, args);
      }, wait);
    }
  }
}