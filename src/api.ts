import axios from 'axios'

export const STATUS_SUCCEED = 1;
export const STATUS_FAILED = 2;
export const STATUS_FAILED_SQL = 4; //SQL 操作出错
export const STATUS_FAILED_NO_ENOUGH_ARGS = 8;
export const STATUS_FAILED_WRONG_POST_DATA = 16;
export const STATUS_FAILED_WRONG_ID = 32;
export const STATUS_FAILED_RECORD_EXISTS = 64;

export interface columns {
  [key: string]: string
}

export interface APIResponse {
  code: number,
  data?: Object | Array<columns>
}

class client {
  private host: string
  private port: number
  private apiUrl = (path: string) => `http://${this.host}:${this.port}/${path}`
  constructor(host: string) {
    this.host = host
    if (process.env.NODE_ENV === 'production') {
      this.port = 443
    } else {
      this.port = 3030
    }
  }

  private async apiGo(method: "GET" | "POST" | "DELETE", url: string, data?: Object): Promise<APIResponse> {
    let res = await axios.request({
      method,
      data,
      url
    })
    const { code, data: resData } = res.data
    if (res.status !== 200 || (code & STATUS_SUCCEED) !== 1)
      throw new Error(res.data)
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
    return await this.apiGo("DELETE", url)
  }

  async update(table: string, id: string, data: Object) {
    const url = this.apiUrl(`${table}/${id}`)
    return await this.apiGo("POST", url, JSON.stringify({
      data
    }))
  }

  /**
   * 
   * @param {*} table 
   * @param {*} data 
   * @returns {code:<number>,lastId:<number>}
   */
  async insert(table: string, data: Object) {
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

const c: client = new client('apibs.chaochaogege.net')
export default c