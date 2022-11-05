// global.MyGlobalClass = class MyGlobalClass {
//   myProp: string
//   constructor(myArg: string){
//     this.myProp = 'created new instance of global class with ' + myArg 
//     console.log(this.myProp)
//   }
//   myMethod(x: number): string {
//     return 'called method myMethod with ' + x
//   }
// }

global.ListNode = class ListNode {
  val: number
  next: ListNode | null
  constructor(val?: number, next?: ListNode | null) {
    this.val = (val===undefined ? 0 : val)
    this.next = (next===undefined ? null : next)
  }
}
