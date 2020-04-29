import axios from 'axios'

export interface columns {
  [key: string]: string | number
}

export interface APIResponse {
  code: number,
  data?: Object | Array<columns>
}

class client {
  host: string
  port: number
  constructor(host: string) {
    this.host = host
    if (process.env.NODE_ENV === 'production') {
      this.port = 443
    } else {
      this.port = 3030
    }
  }

  async apiGo(method: "GET" | "POST" | "DELETE", url: string, data?: Object): Promise<APIResponse> {
    let res = await axios.request({
      method,
      data,
      url
    })
    if (res.status !== 200)
      throw new Error(res.data)
    return res.data
  }
  apiUrl = (path: string) => `http://${this.host}:${this.port}/${path}`
  async fetchUser(fullpath: string): Promise<APIResponse> {
    const url = this.apiUrl(fullpath)
    return await this.apiGo("GET", url)
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

  async fetchColumns(table: string) {
    const url = this.apiUrl(`${table}?columns=true`)
    let data = await this.apiGo("GET", url)
    let columns = []
    if (typeof data !== 'undefined' && Array.isArray(data)) {
      columns = data.map(c => c['COLUMN_NAME'])
    }
    return columns
  }
}

let c: client | null = null

/**
 * 
 * @param {*} host 
 * @returns {client} c
 */
export default function (host: string) {
  if (c !== null)
    return c
  c = new client(host)
  return c
}