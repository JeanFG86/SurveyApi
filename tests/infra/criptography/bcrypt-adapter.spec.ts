import bcrypt from 'bcrypt'
import { BcryptAdapter } from '@/infra/criptography'

jest.mock('bcrypt')

describe('Bcrypt Adapter', () => {
  let sut: BcryptAdapter
  const salt = 12
  let fakeBcrypt: jest.Mocked<typeof bcrypt>

  beforeAll(() => {
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
  })

  beforeEach(() => {
    sut = new BcryptAdapter(salt)
  })

  it('Should call bcrypt with correct value', async () => {
    await sut.encrypt('any_value')

    expect(fakeBcrypt.hash).toHaveBeenCalledWith('any_value', salt)
  })
})
