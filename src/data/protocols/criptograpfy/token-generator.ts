
export interface TokenGenerator{
  generate: (input: TokenGenerator.Input) => Promise<TokenGenerator.OutPut>
}

export namespace TokenGenerator{
  export type Input = { id: string }
  export type OutPut = { token: string }
}
