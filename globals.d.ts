declare global {

  class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null)
  }

}

interface ListNode {
  val: number
  next: ListNode | null
  constructor(val?: number, next?: ListNode | null)
}

export {}
