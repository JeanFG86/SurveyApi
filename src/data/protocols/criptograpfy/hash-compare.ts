
export interface HashComparer{
  compare: (input: HashComparer.Input) => Promise<HashComparer.OutPut>
}

export namespace HashComparer{
  export type Input = {value: string, hash: string}
  export type OutPut = boolean
}
