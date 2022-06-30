import bcrypt from 'bcrypt'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'

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

  it('Should throw if hash throws', async () => {
    fakeBcrypt.hash.mockImplementationOnce(() => { throw new Error('hash_error') })

    const promise = sut.hash('any_value')

    await expect(promise).rejects.toThrow(new Error('hash_error'))
  })

  it('Should call compare with correct values', async () => {
    await sut.compare({
      value: 'any_value',
      hash: 'any_hash'
    })

    expect(fakeBcrypt.compare).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  it('Should return true when compare succeds', async () => {
    fakeBcrypt.compare.mockImplementationOnce(() => true)
    const isValid = await sut.compare({
      value: 'any_value',
      hash: 'any_hash'
    })

    expect(isValid).toBe(true)
  })

  it('Should return false when compare fails', async () => {
    fakeBcrypt.compare.mockImplementationOnce(() => false)

    const isValid = await sut.compare({
      value: 'any_value',
      hash: 'any_hash'
    })

    expect(isValid).toBe(false)
  })

  it('Should throw if compare throws', async () => {
    fakeBcrypt.compare.mockImplementationOnce(() => { throw new Error('compare_error') })

    const promise = sut.compare({
      value: 'any_value',
      hash: 'any_hash'
    })

    await expect(promise).rejects.toThrow(new Error('compare_error'))
  })
})
