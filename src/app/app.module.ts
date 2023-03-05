import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {SchedulerComponent} from "./temps/scheduler/scheduler.component";
import {NavbarComponent} from "./temps/navbar/navbar.component";
import {TempsComponent} from "./temps/temps.component";
import {LoginComponent} from "./login/login.component";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {
  CalendarDateFormatter,
  CalendarModule,
  CalendarMomentDateFormatter,
  DateAdapter,
  MOMENT
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {MatNativeDateModule} from "@angular/material/core";
import * as moment from 'moment';
import {AppRoutingModule} from "./app-routing.module";
import {MatExpansionModule} from "@angular/material/expansion";

export function momentAdapterFactory() {
  return adapterFactory();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TempsComponent,
    NavbarComponent,
    SchedulerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatListModule,
    CalendarModule,
    MatDatepickerModule,
    AppRoutingModule,
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter,
        },
      }
    ),
    MatNativeDateModule,
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
    MatExpansionModule
  ],
  providers: [
    MatDatepickerModule,
    {
      provide: MOMENT,
      useValue: moment,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
