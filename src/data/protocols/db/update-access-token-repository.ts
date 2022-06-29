export interface UpdateAccessTokenRepository{
  update: (input: UpdateAccessTokenRepository.Input) => Promise<void>
}

export namespace UpdateAccessTokenRepository{
  export type Input = { id: string, token: string}
}
