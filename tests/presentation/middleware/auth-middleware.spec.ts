import { forbidden } from '@/presentation/helpers/http'
import { AccessDeniedError } from '@/presentation/errors'
import { AuthMiddleware } from '@/presentation/middlewares'

describe('Auth Middleware', () => {
  let sut: AuthMiddleware

  beforeAll(() => {
  })

  beforeEach(() => {
    sut = new AuthMiddleware()
  })

  it('Should return 403 if no x-access-token exists in headers', async () => {
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
