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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HandelListComponent } from './layouts/handel-list/handel-list.component';



@NgModule({
  declarations: [
    IncidentDashboardComponent,
    IncidentHeaderComponent,
    ServiceSelectorComponent,
    DropDownElementComponent,
    HandelListComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    IncidentRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
]
})
export class IncidentModule { }
