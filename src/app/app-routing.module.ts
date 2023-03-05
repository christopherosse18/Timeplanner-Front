import {LoginComponent} from "./login/login.component";
import {NgModule} from "@angular/core";
import {TempsComponent} from "./temps/temps.component";
import {RouterModule, Routes} from "@angular/router";


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'temps', component: TempsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
