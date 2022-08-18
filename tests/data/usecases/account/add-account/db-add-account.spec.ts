import { AddAccountRepository, CheckAccountByEmailRepository } from '@/data/protocols/db/account'
import { Hasher } from '@/data/protocols/criptograpfy'
import { DbAddAccount } from '@/data/usecases/account/add-account'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbAddAccount Usecase', () => {
  let sut: DbAddAccount
  let encrypt: MockProxy<Hasher>
  let fakeAccountRepository: MockProxy<AddAccountRepository>
  let fakeAccountData: AddAccountRepository.Params
  let fakeCkeckEmailAccount: MockProxy<CheckAccountByEmailRepository>
  beforeAll(() => {
    fakeCkeckEmailAccount = mock()
    fakeCkeckEmailAccount.checkByEmail.mockResolvedValue(false)
    encrypt = mock()
    encrypt.hash.mockResolvedValue('hashed_password')
    fakeAccountRepository = mock()
    fakeAccountRepository.add.mockResolvedValue(true)
    fakeAccountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
  })

  beforeEach(() => {
    sut = new DbAddAccount(encrypt, fakeAccountRepository, fakeCkeckEmailAccount)
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
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })

  it('Should throw AddAccountRepository throws', async () => {
    fakeAccountRepository.add.mockRejectedValueOnce(new Error())

    const promise = sut.add(fakeAccountData)

    await expect(promise).rejects.toThrow()
  })

  it('Should return true on success', async () => {
    const isValid = await sut.add(fakeAccountData)

    expect(isValid).toBeTruthy()
  })

  it('Should return false if AddAccountRepository returns false', async () => {
    fakeAccountRepository.add.mockResolvedValueOnce(false)

    const isValid = await sut.add(fakeAccountData)

    expect(isValid).toBeFalsy()
  })

  it('Should call CkeckAccountByEmailRepository with correct email', async () => {
    await sut.add(fakeAccountData)

    expect(fakeCkeckEmailAccount.checkByEmail).toHaveBeenCalledWith('valid_email@mail.com')
  })

  it('Should return true on success', async () => {
    const isValid = await sut.add(fakeAccountData)

    expect(isValid).toBeTruthy()
  })

  it('Should return false if CkeckAccountByEmailRepository returns true', async () => {
    fakeCkeckEmailAccount.checkByEmail.mockResolvedValueOnce(true)

    const isValid = await sut.add(fakeAccountData)

    expect(isValid).toBeFalsy()
  })
})
