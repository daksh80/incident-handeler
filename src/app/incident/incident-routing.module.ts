import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IncidentDashboardComponent } from "./pages/incident-dashboard/incident-dashboard.component";
import { IncidentTrackerComponent } from "./pages/incident-tracker/incident-tracker.component";

const routes : Routes = [
    {
        path: '',
        children: [
            { path: '',redirectTo: 'incident-dashboard',pathMatch: 'full' },
            { path: 'incident-dashboard', component: IncidentDashboardComponent },
            { path: 'incident-tracker/new', component: IncidentTrackerComponent },
            { path: 'incident-tracker/:id', component: IncidentTrackerComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IncidentRoutingModule {}
