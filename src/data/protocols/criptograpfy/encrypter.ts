
export interface Encrypter{
  encrypt: (input: Encrypter.Input) => Promise<Encrypter.OutPut>
}

export namespace Encrypter{
  export type Input = { value: string }
  export type OutPut = { token: string }
}
