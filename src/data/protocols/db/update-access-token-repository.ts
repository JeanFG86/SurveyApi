export interface UpdateAccessTokenRepository{
  updateAcessToken: (input: UpdateAccessTokenRepository.Input) => Promise<void>
}

export namespace UpdateAccessTokenRepository{
  export type Input = { id: string, token: string}
}
