export type ClassNameable = { className?: string }

export type Uuid = string

// Type to avoid forgetting of passing function params using the next syntax -> (param:? SomeType)
// The correct one -> (param: PossibleUndefined<SomeType>)
export type PossibleUndefined<T> = T | undefined
