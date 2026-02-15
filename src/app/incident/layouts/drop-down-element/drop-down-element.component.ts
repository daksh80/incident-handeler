import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-drop-down-element',
  templateUrl: './drop-down-element.component.html',
  styleUrl: './drop-down-element.component.scss'
})
export class DropDownElementComponent {
  @Output() optionSelected = new EventEmitter<string>();

  options: string[] = [
    'Create Incident',
    'Import Incident',
    'Bulk Upload'
  ];

  selectOption(option: string) {
    this.optionSelected.emit(option);
  }
}
