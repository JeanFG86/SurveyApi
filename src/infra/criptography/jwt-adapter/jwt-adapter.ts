import jwt from 'jsonwebtoken'
import { Encrypter } from '@/data/protocols/criptograpfy'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secrect: string) {}
  async encrypt (input: Encrypter.Input): Promise<Encrypter.OutPut> {
    await jwt.sign({
      id: input.value
    }, this.secrect)
    return { token: undefined }
  }
}
