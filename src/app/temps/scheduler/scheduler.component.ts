import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from "rxjs";
import { addDays } from 'date-fns';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView, DAYS_OF_WEEK,
} from 'angular-calendar';
import {Utilisateur} from "../../interfaces/utilisateur";
import {CustomDateFormatter} from "./custom-date-formatter.provider";


function getDayNumberByName(jour : string){
  let valeurJour: number = 0;
  switch (jour) {
    case "lundi":{
      valeurJour = 1;
      break;
    }
    case "mardi":{
      valeurJour = 2;
      break;
    }
    case "mercredi":{
      valeurJour = 3;
      break;
    }
    case "jeudi":{
      valeurJour = 4;
      break;
    }
    case "vendredi":{
      valeurJour = 5;
      break;
    }
  }
  return valeurJour;
}

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
})
export class SchedulerComponent implements OnInit {

  @Input() user: Utilisateur;
  excludeDays: number[] = [0, 6];
  view: CalendarView = CalendarView.Week;
  clickedDate: Date = new Date();

  clickedColumn: number = 0;

  viewDate = new Date();

  events: CalendarEvent[] = [
    {
      title: 'Resizable event',
      //color: colors.yellow,
      start: new Date("2023-03-06 08:00:00"),
      end: addDays(new Date(), 1), // an end date is always required for resizable events to work
      resizable: {
        beforeStart: true, // this allows you to configure the sides the event is resizable from
        afterEnd: true,
      },
    },
    {
      title: 'A non resizable event',
      //color: colors.blue,
      start: new Date("2023-03-06"),
      end: addDays(new Date(), 1),
    },
  ];
  constructor() {
    // @ts-ignore
    this.user= {departements: [], email: "", idUtilisateur: "", nom: "", prenom: "", temps: undefined, username: ""};

  }


  weekStartsOn = DAYS_OF_WEEK.SUNDAY;

  CalendarView = CalendarView;

  refresh = new Subject<void>();
  panelOpenState: boolean = false;

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    alert(newEnd)
    this.refresh.next();
  }

  addNonWorkedDays(excludeDays: number[]){
    this.user.departements.forEach(function (dep){
      dep.contratJours.forEach(function (jour){
        if (jour.conge){
          excludeDays.push(getDayNumberByName(jour.jour))
        }
      })
    })
  }
  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }

  ngOnInit(): void {
    this.addNonWorkedDays(this.excludeDays)
  }

}
