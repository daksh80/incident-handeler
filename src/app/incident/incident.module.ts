import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentDashboardComponent } from './pages/incident-dashboard/incident-dashboard.component';
import { IncidentHeaderComponent } from "./layouts/incident-header/incident-header.component";
import { IncidentRoutingModule } from './incident-routing.module';



@NgModule({
  declarations: [
    IncidentDashboardComponent
  ],
  imports: [
    CommonModule,
    IncidentRoutingModule,
    IncidentHeaderComponent
]
})
export class IncidentModule { }
