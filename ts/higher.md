# ts 进阶

## 01——泛型

```typescript
// 在方法中泛型的使用
function join<T, P>(first: T, second: P): T {
  return first;
}

join<number, string>(1, "1");

// 在类中使用泛型
interface Item {
  name: string;
}

class DataManager<T extends Item> {
  constructor(private data: T[]) {}
  getItem(index: number): string {
    return this.data[index].name;
  }
}

const data = new DataManager([{ name: "Eric" }]);
console.log(data.getItem(0));
```
