import { LogControllerDecorator } from '@/main/decorators'
import { Controller } from '@/presentation/protocols'
import { mock, MockProxy } from 'jest-mock-extended'

describe('LogController Decorator', () => {
  let sut: LogControllerDecorator
  let fakeController: MockProxy<Controller>

  beforeAll(() => {
    fakeController = mock()
    fakeController.handle.mockResolvedValue({
      statusCode: 200,
      body: {
        name: 'Jean'
      }
    })
  })

  beforeEach(() => {
    sut = new LogControllerDecorator(fakeController)
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
})
