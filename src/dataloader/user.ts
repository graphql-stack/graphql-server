import Dataloader from 'dataloader'
import axios from 'axios'

const getUsers = (ids: any[]): Promise<any[]> => {
  return axios.get<any[]>(`${process.env.BACKEND_ENDPOINT}users_batch?ids=${ids.join(',')}`)
    .then(res => res.data)
}

export const userLoader = new Dataloader<any, any[]>(getUsers)
