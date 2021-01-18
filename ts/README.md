# ts 基础

```typescript
// 常见的ts函数的定义
function foo(name: string): string {
  return name;
}
const foo1 = (name: string): string => {
  return name;
};
const foo2: (name: string) => string = () => {
  return name;
};

// ts元组数据类型
const userInfo: [string, string, number] = ["Eric", "male", 22];

// 类型别名 type
type user = {
name: string;
age: number;
};
const userList: user[] = [
{
name: "Eric",
age: 22
}
];

// 接口 interface
interface Person {
readonly name: string;
age?: number; // age 可有可无
[propName: string]: any; // 可随意添加任何属性
say(): string;
}

// ts 对类的变量封装
class Person{
constructor(private \_name:string){};
get name(){
return this.\_name;
}
set name(name:string){
this.\_name=name;
}
}

const person=new person('Eric');
person.name='Ericfirst';
console.log(person.name);

// ts 的单例模式
class Demo {
private static instance: Demo;
private constructor(private name: string) {}
static getInstance() {
if (!this.instance) this.instance = new Demo("Eric");
return this.instance;
}
}

const demo1 = Demo.getInstance();
const demo2 = Demo.getInstance();
console.log(demo1);
console.log(demo2);
```
