import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '', redirectTo: 'incidents', pathMatch: 'full'
    },
    {
        path: 'incidents', loadChildren: () => import('./incident/incident.module').then(m => m.IncidentModule)
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
