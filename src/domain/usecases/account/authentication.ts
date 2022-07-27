export interface Authentication{
  auth: (input: Authentication.Input) => Promise<Authentication.OutPut>
}

export namespace Authentication{
  export type Input = {email: string, password: string}
  export type OutPut = {token: string | undefined}
}
