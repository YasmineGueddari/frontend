
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate'
})
export class PaginatePipe implements PipeTransform {
  transform(array: any[], itemsPerPage: number, currentPage: number): any[] {
    if (!array || array.length === 0) return []; // Retourne un tableau vide si l'entrée est nulle ou vide

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, array.length);

    return array.slice(startIndex, endIndex);
  }
}
