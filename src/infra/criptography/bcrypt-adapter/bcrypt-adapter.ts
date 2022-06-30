import bcrypt from 'bcrypt'
import { HashComparer, Hasher } from '@/data/protocols/criptograpfy'

export class BcryptAdapter implements Hasher, HashComparer {
  constructor (private readonly salt: number) {}
  async compare (input: HashComparer.Input): Promise<boolean> {
    const isValid = await bcrypt.compare(input.value, input.hash)
    return isValid
  }

  async hash (value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }
}
