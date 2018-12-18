import { RESTDataSource } from 'apollo-datasource-rest'

export class BooksDatasource extends RESTDataSource {
  private cacheOpts: any

  constructor() {
    super()
    this.baseURL = 'http://localhost:8080/v1/'
    this.cacheOpts = {
      ttl: 3600
    }
  }

  async getBooks(limit: number, offset: number) {
    return this.get('books', {
      limit,
      offset
    }, this.cacheOpts)
  }

  async getBook(id: string) {
    return this.get(`books/${id}`, null, this.cacheOpts)
  }
}

export class UserDatasource extends RESTDataSource {
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
