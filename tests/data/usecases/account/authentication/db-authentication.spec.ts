import { HashComparer, Encrypter } from '@/data/protocols/criptograpfy'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '@/data/protocols/db/account'
import { DbAuthentication } from '@/data/usecases/account/authentication'
import { Authentication } from '@/domain/usecases'
import { mock, MockProxy } from 'jest-mock-extended'

describe('DbAuthentication UseCase', () => {
  let sut: DbAuthentication
  let fakeHashCompare: MockProxy<HashComparer>
  let fakeEncrypter: MockProxy<Encrypter>
  let fakeUpdateAccessTokenRepo: MockProxy<UpdateAccessTokenRepository>
  let fakeLoadAccount: MockProxy<LoadAccountByEmailRepository>
  let fakeAuthentication: MockProxy<Authentication.Params>
  beforeAll(() => {
    fakeAuthentication = {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    fakeLoadAccount = mock()
    fakeLoadAccount.loadByEmail.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
    fakeHashCompare = mock()
    fakeHashCompare.compare.mockResolvedValue(true)
    fakeEncrypter = mock()
    fakeEncrypter.encrypt.mockResolvedValue({ token: 'any_token' })
    fakeUpdateAccessTokenRepo = mock()
    fakeUpdateAccessTokenRepo.updateAccessToken.mockResolvedValue()
  })

  beforeEach(() => {
    sut = new DbAuthentication(
      fakeLoadAccount,
      fakeHashCompare,
      fakeEncrypter,
      fakeUpdateAccessTokenRepo
    )
  })

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    await sut.auth(fakeAuthentication)

    expect(fakeLoadAccount.loadByEmail).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if LoadAccountByEmailRepository thorws', async () => {
    fakeLoadAccount.loadByEmail.mockRejectedValueOnce(new Error())

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })

  it('Should return undefined if LoadAccountByEmailRepository returns undefined', async () => {
    fakeLoadAccount.loadByEmail.mockResolvedValueOnce(null)

    const model = await sut.auth(fakeAuthentication)

    expect(model?.accessToken).toBeUndefined()
    expect(model?.name).toBeUndefined()
  })

  it('Should call HashComparer with correct values', async () => {
    const conpareSpy = jest.spyOn(fakeHashCompare, 'compare')

    await sut.auth(fakeAuthentication)

    expect(conpareSpy).toHaveBeenLastCalledWith({ value: 'any_password', hash: 'hashed_password' })
  })

  it('Should throw if HashComparer thorws', async () => {
    fakeHashCompare.compare.mockRejectedValueOnce(new Error())

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })

  it('Should return undefined if HashComparer returns false', async () => {
    fakeHashCompare.compare.mockResolvedValueOnce(false)

    const model = await sut.auth(fakeAuthentication)

    expect(model?.accessToken).toBeUndefined()
    expect(model?.name).toBeUndefined()
  })

  it('Should call Encrypter with correct id', async () => {
    const generateSpy = jest.spyOn(fakeEncrypter, 'encrypt')

    await sut.auth(fakeAuthentication)

    expect(generateSpy).toHaveBeenLastCalledWith({ value: 'any_id' })
  })

  it('Should throw if Encrypter thorws', async () => {
    fakeEncrypter.encrypt.mockRejectedValueOnce(new Error())

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })

  it('Should returns an Authentication model on success', async () => {
    const accessToken = await sut.auth(fakeAuthentication)

    expect(accessToken?.accessToken).toBe('any_token')
    expect(accessToken?.name).toBe('any_name')
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const updateSpy = jest.spyOn(fakeUpdateAccessTokenRepo, 'updateAccessToken')

    await sut.auth(fakeAuthentication)

    expect(updateSpy).toHaveBeenLastCalledWith({ id: 'any_id', token: 'any_token' })
  })

  it('Should throw if UpdateAccessTokenRepository thorws', async () => {
    fakeUpdateAccessTokenRepo.updateAccessToken.mockRejectedValueOnce(new Error())

    const promise = sut.auth(fakeAuthentication)

    await expect(promise).rejects.toThrow()
  })
})
