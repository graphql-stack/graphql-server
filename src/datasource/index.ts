import { RESTDataSource } from 'apollo-datasource-rest'
import { RESTDataSourcePlus } from '@zcong/apollo-datasource-rest-plus'

export class MeDatasource extends RESTDataSourcePlus {
  constructor(baseURL: string) {
    super()
    this.baseURL = baseURL
  }

  async me() {
    return this.get(`me`)
  }
}

export class CommentsDatasource extends RESTDataSource {
  constructor(baseURL: string) {
    super()
    this.baseURL = baseURL
  }

  async getComments(id: string) {
    return this.get(`posts/${id}/comments`)
  }
}
