import { Component } from '@angular/core';

@Component({
  selector: 'app-drop-down-element',
  templateUrl: './drop-down-element.component.html',
  styleUrl: './drop-down-element.component.scss'
})
export class DropDownElementComponent {
 options: string[] = [
    'Create Incident',
    'Import Incident',
    'Bulk Upload'
  ];

  selectOption(option: string) {
    console.log(option);
  }
}
