import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebPagesComponent } from './web-pages.component';
import { RegisterWebPage } from "./register-web-page/register-web-page.component";
import { PageDetails } from "./details/web-page-details.component";
import { WebPageLogs } from "./logs/logs.component";

const routes: Routes = [
    { path: "", component: WebPagesComponent },
    { path: "registerWebPage", pathMatch: "full", component: RegisterWebPage },
    { path: ":id", component: PageDetails },
    { path: ":id/logs", component: WebPageLogs },

];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(routes)]
})
export class WebpagesRoutingModule {
}
