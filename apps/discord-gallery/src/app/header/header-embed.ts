import { Type } from "@angular/core";


export default interface IHeaderEmbed<T> {
  component: Type<T>,
  data: Partial<T>
}
