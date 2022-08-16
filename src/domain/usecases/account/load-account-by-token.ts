
export namespace LoadAccountByToken{
  export type Params =
    {
      accessToken: string
      role?: string
    }
  export type Result = {id: string} | undefined
}

export interface LoadAccountByToken{
  load: (input: LoadAccountByToken.Params) => Promise<LoadAccountByToken.Result>
}
