import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IncidentDashboardComponent } from "./pages/incident-dashboard/incident-dashboard.component";

const routes : Routes = [
    {
        path: '',
        children: [
            { path: '',redirectTo: 'incident-dashboard',pathMatch: 'full' },
            { path: 'incident-dashboard', component: IncidentDashboardComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class IncidentRoutingModule {}