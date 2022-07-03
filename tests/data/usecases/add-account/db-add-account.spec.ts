import { AddAccountRepository } from '@/data/protocols/db/account'
import { Hasher } from '@/data/protocols/criptograpfy'
import { DbAddAccount } from '@/data/usecases/add-account'
import { AccountModel } from '@/domain/models'
import { AddAccountModel } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbAddAccount Usecase', () => {
  let sut: DbAddAccount
  let encrypt: MockProxy<Hasher>
  let fakeAccount: MockProxy<AccountModel>
  let fakeAccountRepository: MockProxy<AddAccountRepository>
  let fakeAccountData: MockProxy<AddAccountModel>

  beforeAll(() => {
    encrypt = mock()
    encrypt.hash.mockResolvedValue('hashed_password')
    fakeAccount = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    }
    fakeAccountRepository = mock()
    fakeAccountRepository.add.mockResolvedValue(fakeAccount)
    fakeAccountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
  })

  beforeEach(() => {
    sut = new DbAddAccount(encrypt, fakeAccountRepository)
  })

  it('Should call Hasher with correct password', async () => {
    const encryptSpy = jest.spyOn(encrypt, 'hash')

    await sut.add(fakeAccountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw Hasher throws', async () => {
    encrypt.hash.mockRejectedValueOnce(new Error())

    const promise = sut.add(fakeAccountData)

    await expect(promise).rejects.toThrow()
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const addSpy = jest.spyOn(fakeAccountRepository, 'add')

    await sut.add(fakeAccountData)

    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  it('Should throw AddAccountRepository throws', async () => {
    fakeAccountRepository.add.mockRejectedValueOnce(new Error())

    const promise = sut.add(fakeAccountData)

    await expect(promise).rejects.toThrow()
  })

  it('Should return an account on success', async () => {
    const account = await sut.add(fakeAccountData)

    expect(account).toEqual(fakeAccount)
  })
})
