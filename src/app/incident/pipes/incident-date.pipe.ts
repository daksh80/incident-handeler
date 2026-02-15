import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'incidentDate'
})
export class IncidentDatePipe implements PipeTransform {
  transform(value: string | Date | number | null | undefined, format: 'short' | 'long' = 'short'): string {
    if (!value) {
      return '';
    }

    const asString = typeof value === 'string' ? value : '';

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(asString) || /^[A-Za-z]+\s+\d{1,2},\s+\d{4}$/.test(asString)) {
      return asString;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return asString || '';
    }

    if (format === 'long') {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }

    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }
}
