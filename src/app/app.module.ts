import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

import { AppComponent } from './app.component';
import {EventDetails, SchedulerComponent} from "./temps/scheduler/scheduler.component";
import {NavbarComponent} from "./temps/navbar/navbar.component";
import {TempsComponent} from "./temps/temps.component";
import {LoginComponent} from "./login/login.component";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
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
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import * as moment from 'moment';
import {AppRoutingModule} from "./app-routing.module";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDialogModule} from "@angular/material/dialog";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import {registerLocaleData} from "@angular/common";
import {MatSelectModule} from "@angular/material/select";
import {MatSidenavModule} from "@angular/material/sidenav";

export function momentAdapterFactory() {
  return adapterFactory();
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TempsComponent,
    NavbarComponent,
    SchedulerComponent,
    EventDetails
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
    MatExpansionModule,
    MatDialogModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    MatSidenavModule,
  ],
  providers: [
    MatDatepickerModule,
    {
      provide: MOMENT,
      useValue: moment,
    },
    { provide: LOCALE_ID, useValue: 'fr-FR'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
