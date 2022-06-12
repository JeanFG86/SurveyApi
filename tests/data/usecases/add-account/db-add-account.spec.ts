import { AddAccountRepository, Encrypter } from '@/data/protocols'
import { DbAddAccount } from '@/data/usecases/add-account'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbAddAccount Usecase', () => {
  let sut: DbAddAccount
  let encrypt: MockProxy<Encrypter>
  let fakeAccount: MockProxy<AddAccountRepository>
  beforeAll(() => {
    encrypt = mock()
    encrypt.encrypt.mockResolvedValue('hashed_password')
    fakeAccount = mock()
    fakeAccount.add.mockResolvedValue({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  beforeEach(() => {
    sut = new DbAddAccount(encrypt, fakeAccount)
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

  it('Should throw Encrypter throws', async () => {
    encrypt.encrypt.mockRejectedValueOnce(new Error())
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const addSpy = jest.spyOn(fakeAccount, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })
})
