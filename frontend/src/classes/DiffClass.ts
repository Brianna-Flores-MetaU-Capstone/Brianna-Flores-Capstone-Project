type GPQuantityChangeType<T> = {
    itemA: T
    itemB: T
}
type GPDiffReturnType<T> = {
    added: T[]
    deleted: T[]
    changed: GPQuantityChangeType<T>[]
    unchanged: T[]
}

abstract class Diff <T> {
    abstract getDiffResults(itemA: T, itemB: T): GPDiffReturnType<T>
}