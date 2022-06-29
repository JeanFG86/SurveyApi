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

  it('Should call hash with correct values', async () => {
    await sut.hash('any_value')

    expect(fakeBcrypt.hash).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a valid hash on hash success', async () => {
    fakeBcrypt.hash.mockImplementationOnce(() => 'hash')

    const hash = await sut.hash('any_value')

    expect(hash).toBe('hash')
  })

  it('Should throw if bcrypt throws', async () => {
    fakeBcrypt.hash.mockImplementationOnce(() => { throw new Error('bcrypt_error') })

    const promise = sut.hash('any_value')

    await expect(promise).rejects.toThrow(new Error('bcrypt_error'))
  })

  it('Should call compare with correct values', async () => {
    await sut.compare({
      value: 'any_value',
      hash: 'any_hash'
    })

    expect(fakeBcrypt.compare).toHaveBeenCalledWith('any_value', 'any_hash')
  })
})
