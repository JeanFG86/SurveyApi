import { LogErrorRepository } from '@/data/protocols'
import { AccountModel } from '@/domain/models'
import { LogControllerDecorator } from '@/main/decorators'
import { ok, serverError } from '@/presentation/helpers/http'
import { Controller, HttpRequest } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'

describe('LogController Decorator', () => {
  let sut: LogControllerDecorator
  let fakeController: MockProxy<Controller>
  let fakeLogErrorRepository: MockProxy<LogErrorRepository>
  let fakeRequest: MockProxy<HttpRequest>
  let fakeAccount: MockProxy<AccountModel>
  let fakeError: Error

  beforeAll(() => {
    fakeAccount = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    fakeController = mock()
    fakeController.handle.mockResolvedValue(ok(fakeAccount))
    fakeLogErrorRepository = mock()
    fakeLogErrorRepository.logError.mockResolvedValue(new Promise(resolve => resolve()))
    fakeRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    fakeError = new Error()
    fakeError.stack = 'any_stack'
  })

  beforeEach(() => {
    sut = new LogControllerDecorator(fakeController, fakeLogErrorRepository)
  })

  it('Should call controller handle', async () => {
    const handleSpy = jest.spyOn(fakeController, 'handle')

    await sut.handle(fakeRequest)

    expect(handleSpy).toHaveBeenCalledWith(fakeRequest)
  })

  it('Should return the same result of the controller', async () => {
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(ok(fakeAccount))
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(fakeLogErrorRepository, 'logError')
    fakeController.handle.mockResolvedValueOnce(error)

    await sut.handle(fakeRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
