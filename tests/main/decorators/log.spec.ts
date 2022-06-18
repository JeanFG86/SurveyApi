import { LogErrorRepository } from '@/data/protocols'
import { LogControllerDecorator } from '@/main/decorators'
import { serverError } from '@/presentation/helpers'
import { Controller } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'

describe('LogController Decorator', () => {
  let sut: LogControllerDecorator
  let fakeController: MockProxy<Controller>
  let fakeLogErrorRepository: MockProxy<LogErrorRepository>

  beforeAll(() => {
    fakeController = mock()
    fakeController.handle.mockResolvedValue({
      statusCode: 200,
      body: {
        name: 'Jean'
      }
    })
    fakeLogErrorRepository = mock()
    fakeLogErrorRepository.log.mockResolvedValue(new Promise(resolve => resolve()))
  })

  beforeEach(() => {
    sut = new LogControllerDecorator(fakeController, fakeLogErrorRepository)
  })

  it('Should call controller handle', async () => {
    const handleSpy = jest.spyOn(fakeController, 'handle')
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  it('Should return the same result of the controller', async () => {
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'Jean'
      }
    })
  })

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    const logSpy = jest.spyOn(fakeLogErrorRepository, 'log')
    fakeController.handle.mockResolvedValueOnce(error)

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
