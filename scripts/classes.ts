String.prototype.customGlobalMethod = function(someArg: string): number {
  console.log('you called the custom str method with ' + someArg)
  return 2
}

global.myGlobalFunc = (a: string) => {
  a = 'you called the global func with ' + a
  console.log(a)
  return a
} 

global.MyGlobalClass = class MyGlobalClass {
  myProp: string
  constructor(myArg: string){
    this.myProp = 'created new instance of global class with ' + myArg 
    console.log(this.myProp)
  }
  myMethod(x: number): string {
    return 'called method myMethod with ' + x
  }
}
