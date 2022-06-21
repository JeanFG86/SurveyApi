import { LoginController } from '@/presentation/controllers/login'
import { MissingParamError } from '@/presentation/errors'
import { badRequest } from '@/presentation/helpers'

describe('Login Controller', () => {
  let sut: LoginController
  beforeAll(() => {

  })

  beforeEach(() => {
    sut = new LoginController()
  })

  it('Should return 400 if no email is provided', async () => {
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
