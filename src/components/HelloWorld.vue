<script setup lang="ts">

// 异步回调数组类型接口
interface AsyncFunc {
  onResolved: Function
  onRejected: Function
}

class Promise {
  PromiseState: string
  PromiseResult: unknown
  callbacks: Array<AsyncFunc>
  static deferred: () => {}

  constructor(executor: Function) {
    // 状态和结果
    this.PromiseState = "pending"
    this.PromiseResult = undefined
    // 回调数组 处理异步
    this.callbacks = []

    // 改变为成功状态，并且唯一性
    const resolve = (data: string) => {
      if (this.PromiseState !== "pending") return
      this.PromiseState = "resolved"
      this.PromiseResult = data
      // 指定多个回调
      if (this.callbacks.length !== 0) {
        // 异步执行回调
        setTimeout(() => {
          this.callbacks.forEach(callback => {
            callback.onResolved(data)
          })
        })
      }
    }

    // 改变为失败状态，并且唯一性
    const reject = (data: unknown) => {
      if (this.PromiseState !== "pending") return
      this.PromiseState = "rejected"
      this.PromiseResult = data
      // 指定多个回调
      if (this.callbacks.length !== 0) {
        setTimeout(() => {
          this.callbacks.forEach(callback => {
            callback.onRejected(data)
          })
        })
      }
    }

    // 同步构造器/throw改变状态
    try {
      executor(resolve, reject)
    } catch (e: unknown) {
      // 修改 promise 对象状态为 【失败】
      reject(e)
    }

  }

  // then 方法，返回 Promise 类型
  then(onResolved?: unknown, onRejected?: unknown): Promise{
    const outer = this
    // 判断回调参数
    if (typeof onRejected !== 'function') {
      onRejected = (reason: unknown) => {
        // 一直想链下抛错误，知道catch捕获
        throw reason
      }
    }
    if (typeof onResolved !== 'function') {
      onResolved = (value: unknown) => value
    }
    return new Promise((resolve: Function, reject: Function) => {
      // 封装函数
      function callback(type: Function) {
        // 调用函数的结果是返回值的结果
        try{
          const result = type(outer.PromiseResult)
          if (result instanceof Promise) {
            result.then((v: unknown) => {
              resolve(v)
            }, (r: unknown) => {
              reject(r)
            })
          } else {
            resolve(result)
          }
        } catch (e) {
          reject(e)
        }
      }
      // resolve 状态调用回调函数
      if (this.PromiseState === "resolved") {
        setTimeout(() => {
          callback(onResolved as Function)
        })
      }
      // reject 状态
      if (this.PromiseState === "rejected") {
        setTimeout(() => {
          callback(onRejected as Function)
        })
      }
      // pending 状态 / 异步
      if (this.PromiseState === "pending") {
        // 保存回调函数
        this.callbacks.push({
          onResolved: function () {
            callback(onResolved as Function)
          },
          onRejected: function () {
            callback(onRejected as Function)
          }
        })
      }
    })
  }

  // catch 方法
  catch(onRejected: Function) {
    return this.then(undefined, onRejected);
  }

  // resolve 快速创建promise对象
  static resolve(value: unknown) {
    // 返回 promise 对象
    return new Promise((resolve: Function, reject: Function) => {
      if (value instanceof Promise) {
        value.then((v: unknown) => {
          resolve(v)
        }, (r: unknown) => {
          reject(r)
        })
      } else {
        // 状态设置为成功
        resolve(value);
      }
    })
  }

  // 返回promise对象
  static reject(reason: unknown) {
    return new Promise((resolve: Function, reject: Function) => {
      reject(reason)
    })
  }

  // 返回promise对象
  static all(promises: Array<Promise>) {
    return new Promise((resolve: Function, reject: Function) => {
      let count: number = 0
      // 成功结果的数组
      let arr: Array<any> = []
      // 遍历
      for (let i = 0; i < promises.length; i++) {
        //
        promises[i].then((v: unknown) => {
          // 得知对象的状态是成功
          // 全部promise对象 都成功
          count++
          arr[i] = v;
          if (count === promises.length) {
            // 修改状态
            resolve(arr)
          }
        }, (r: unknown) => {
          // 遇到失败整体返回失败
          reject(r)
        })
      }
    })
  }

  // 返回promise对象
  static race(promises: Array<Promise>) {
    return new Promise((resolve : Function, reject: Function) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then((v: unknown) => {
          // 谁先成功就改变返回结果
          resolve(v)
        }, (r: unknown) => {
          reject(r)
        })
      }
    })
  }
}

const p = new Promise((resolve: Function, reject: Function) => {

    resolve('yes')

})

const p1 = Promise.resolve('111')
const p2 = Promise.reject('error')

const p3 = Promise.race([p, p1, p2])

console.log('333')
console.log(p1)
console.log(p2)
console.log(p3)


</script>

<template>
  <div>
    Promise类具体实现
  </div>
</template>

<style scoped>

</style>
