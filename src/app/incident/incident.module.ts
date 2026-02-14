import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentDashboardComponent } from './pages/incident-dashboard/incident-dashboard.component';
import { IncidentHeaderComponent } from "./layouts/incident-header/incident-header.component";
import { IncidentRoutingModule } from './incident-routing.module';
import { ServiceSelectorComponent } from './layouts/service-selector/service-selector.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DropDownElementComponent } from './layouts/drop-down-element/drop-down-element.component';



@NgModule({
  declarations: [
    IncidentDashboardComponent,
    IncidentHeaderComponent,
    ServiceSelectorComponent,
    DropDownElementComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    IncidentRoutingModule
]
})
export class IncidentModule { }
