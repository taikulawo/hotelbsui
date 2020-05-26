import { Columns } from "./store/reducers/user"
import { useState } from "react"

export function convertToDataSource(data: Array<Columns>, pk: string): Array<{ [key: string]: string }> {
  let a = data.map((d: any) => ({
    ...d,
    key: d[pk],
  }))
  return a
}

/**
 * 
 * @param {Array} data 
 */
export function convertToColumn(keys: Array<string>,pk: string): any[] {
  // remove id column
  keys = removeFromArray(keys, pk)
  let columns = keys.map(k => ({
    title: k,
    dataIndex: k,
    width: "15%"
  }))
  return columns
}


export function removeFromArray(a: Array<any>, k: string) {
  a = Array.of(...a)
  let idx = a.indexOf(k)
  if (idx >= 0)
    a.splice(idx, 1)
  return a
}

/**
 * Remove necessary key value from obj
 */
export function except<T extends { [key: string]: any }>(obj: T, keys: Array<string>) {
  keys.forEach(k => obj.hasOwnProperty(k) && delete obj[k])
  return obj
}
/**
 * 
 * @param {String} s 
 * @param  {...number} point
 * @example
 * >> splitString('0adbc0dc318a4a6fb516cc54c9af194c',7,11,15,19)
 * << ["0adbc0dc", "318a", "4a6f", "b516", "cc54c9af194c"]
 */
export function splitString(s: string, ...point: Array<number>) {
  let last = 0
  let result = []
  point.forEach((num, idx) => {
    result[idx] = s.substring(last, num + 1)
    last = num + 1
  })
  result.push(s.substring(last))
  return result
}

export function useObservable(obj:any, isasync = false) {
  let asyncid:any = null;
  const [originobj, setoriginobj] = useState(obj);
  const handler: ProxyHandler<any> = {
    get: (target, prop) => {
      // 递归创建并返回
      if (typeof target[prop] === "object" && target[prop] !== null) {
        return new Proxy(target[prop], handler);
      }

      return Reflect.get(target, prop);
    },
    set: (target, prop, value) => {
      const result = Reflect.set(target, prop, value);

      if (isasync) {
        if (asyncid) {
          clearTimeout(asyncid);
        }

        asyncid = setTimeout(() => {
          setoriginobj(originobj);
        }, 0);
      } else {
        setoriginobj(Object.assign({}, originobj));
      }

      return result;
    }
  };
  const proxyobj = new Proxy(originobj, handler);
  Reflect.defineProperty(proxyobj, originobj, { value: '"$$origindata"' });
  return proxyobj;
}