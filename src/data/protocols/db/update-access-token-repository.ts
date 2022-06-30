export interface UpdateAccessTokenRepository{
  updateAccessToken: (input: UpdateAccessTokenRepository.Input) => Promise<void>
}

export namespace UpdateAccessTokenRepository{
  export type Input = { id: string, token: string}
}
