import { Encrypter } from '@/data/protocols'
import { DbAddAccount } from '@/data/usecases/add-account'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbAddAccount Usecase', () => {
  let sut: DbAddAccount
  let encrypt: MockProxy<Encrypter>
  beforeAll(() => {
    encrypt = mock()
    encrypt.encrypt.mockResolvedValue('hashed_password')
  })

  beforeEach(() => {
    sut = new DbAddAccount(encrypt)
  })

  it('Should call Encrypter with correct password', async () => {
    const encryptSpy = jest.spyOn(encrypt, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
