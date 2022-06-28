import { LoadAccountByEmailRepository } from '@/data/protocols/db'
import { Authentication } from '@/domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository) { }
  async auth (input: Authentication.Input): Promise<Authentication.OutPut> {
    await this.loadAccountByEmailRepository.load(input.email)
    return await new Promise(resolve => resolve({ token: undefined }))
  }
}
