import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-incident-header',
  templateUrl: './incident-header.component.html',
  styleUrl: './incident-header.component.scss',
  standalone: false
})
export class IncidentHeaderComponent implements OnInit {
 public title: string = "";
  constructor() { }
  ngOnInit(): void {
    this.title = "Incident Management";
  }
 

}
