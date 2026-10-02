import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items || !filter) {
      return items;
    }
    
    return items.filter(item => {
      const notMatchingField = Object.keys(filter).find(key => {
        return item[key] !== filter[key];
      });
      
      return !notMatchingField; // Return true if all fields match
    });
  }
}