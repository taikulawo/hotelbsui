import { UserColumns } from "./store/reducers/user"
import { Staffs } from "./store/reducers/user"

export function convertToDataSource(data: Array<UserColumns>): Array<{[key:string]:string}> {
  let a = data.map(d => ({
    ...d,
    key: d['id'],
  }))
  return a
}

/**
 * 
 * @param {Array} data 
 */
export function convertToColumn(keys: Array<string>):any[] {
  // remove id column
  keys = removeFromArray(keys, 'id')
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