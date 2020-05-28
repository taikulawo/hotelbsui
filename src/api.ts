import axios, { AxiosResponse } from 'axios'

export const STATUS_SUCCEED = 1;
export const STATUS_FAILED = 1 << 1;
export const STATUS_FAILED_SQL = 1 << 2; //SQL 操作出错
export const STATUS_FAILED_NO_ENOUGH_ARGS = 1 << 3;
export const STATUS_FAILED_WRONG_POST_DATA = 1 << 4;
export const STATUS_FAILED_WRONG_ID = 1 << 5;
export const STATUS_FAILED_RECORD_EXISTS = 1 << 6;
export const STATUS_FAILED_NEED_LOGIN = 1 << 7

export interface columns {
  [key: string]: string
}

export type ResponseData = any | Array<columns>

export interface APIResponse {
  code: number,
  data: ResponseData
}

class client {
  public host: string
  // public port: number
  public protocol: string
  public apiUrl = (path: string) => `${this.protocol}://${this.host}/api/${path}`
  constructor(host: string) {
    this.host = host
    if (window.location.protocol === "https") {
      this.protocol = "https"
      // this.port = 443
      // this.port = 3030
    } else {
      // this.port = 3030
      this.protocol = "http"
    }
  }

  public async apiGo(method: "GET" | "POST" | "DELETE", url: string, data?: Object): Promise<APIResponse> {
    let res = await axios.request<any, AxiosResponse<APIResponse>>({
      method,
      data,
      url,
      withCredentials: true
    })
    return res.data
  }
  async querySingle(table: string, id: string): Promise<APIResponse> {
    const url = this.apiUrl(`${table}/${id}`)
    return await this.apiGo("GET", url)
  }

  /**
   * 
   * @param {*} table 
   * @returns {code: <number>, data:<Array>}
   */
  async queryAll(table: string) {
    const url = this.apiUrl(table)
    return await this.apiGo("GET", url)
  }

  async deleteAll(table: string) {
    const url = this.apiUrl(table)
    return await this.apiGo("DELETE", url)
  }
  async deleteSingle(table: string, id: string) {
    const url = this.apiUrl(`${table}/${id}`)
    const { data } = await this.apiGo("DELETE", url)
    return data
  }

  async update(table: string, id: string, data: Object) {
    const url = this.apiUrl(`${table}/${id}`)
    const { data: d1 } = await this.apiGo("POST", url, JSON.stringify({
      data
    }))
    return d1
  }

  /**
   * 
   * @param {*} table 
   * @param {*} data 
   * @returns {code:<number>,lastId:<number>}
   */
  async insert(table: string, data: Object): Promise<APIResponse> {
    const url = this.apiUrl(`${table}`)
    return await this.apiGo("POST", url, JSON.stringify({
      data
    }))
  }

  async fetchColumns(table: string): Promise<Array<string>> {
    const url = this.apiUrl(`${table}?columns=true`)
    let { data } = await this.apiGo("GET", url)
    let cols: string[] = []
    if (typeof data !== 'undefined' && Array.isArray(data)) {
      cols = data.map(c => c['COLUMN_NAME'])
    }
    return cols
  }
}



const c: client = new client(window.location.host)
export default c