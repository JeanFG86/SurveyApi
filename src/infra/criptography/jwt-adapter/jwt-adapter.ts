import jwt from 'jsonwebtoken'
import { Decrypter, Encrypter } from '@/data/protocols/criptograpfy'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secrect: string) {}

  async encrypt (input: Encrypter.Input): Promise<Encrypter.OutPut> {
    const accessToken = await jwt.sign({
      id: input.value
    }, this.secrect)
    return { token: accessToken }
  }

  async decrypt (token: string): Promise<string | undefined> {
    const value: any = await jwt.verify(token, this.secrect)
    return value
  }
}
