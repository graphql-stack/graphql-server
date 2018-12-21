import { RESTDataSourcePlus } from '@zcong/apollo-datasource-rest-plus'

export class BooksDatasource extends RESTDataSourcePlus {
  constructor() {
    super()
    this.baseURL = 'http://localhost:8080/v1/'
  }

  async getBooks(limit: number, offset: number) {
    return this.get('books', {
      limit,
      offset
    })
  }

  async getBook(id: number) {
    return this.get(`books/${id}`)
  }
}

export class UserDatasource extends RESTDataSourcePlus {
  private cacheOpts: any

  constructor() {
    super()
    this.baseURL = 'http://localhost:8080/v1/'
    this.cacheOpts = {
      ttl: 3600
    }
  }

  async getUser(id: string) {
    return this.get(`users/${id}`, null, this.cacheOpts)
  }
}

export class MeDatasource extends RESTDataSourcePlus {
  constructor() {
    super()
    this.baseURL = 'http://localhost:8080/v1/'
  }

  async me() {
    return this.get(`me`)
  }
}
