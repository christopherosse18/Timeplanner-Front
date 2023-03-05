import {ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {async, Subject} from "rxjs";
import { addDays } from 'date-fns';
import {
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView, DAYS_OF_WEEK,
} from 'angular-calendar';
import {Utilisateur} from "../../interfaces/utilisateur";
import {CustomDateFormatter} from "./custom-date-formatter.provider";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";


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
  // @ts-ignore
  currentEvent: CalendarEvent = {
    title: 'Resizable event',
    //color: colors.yellow,
    start: new Date("2023-03-06 08:00:00"),
    end: addDays(new Date(), 1), // an end date is always required for resizable events to work
    resizable: {
      beforeStart: true, // this allows you to configure the sides the event is resizable from
      afterEnd: true,
    },
  };

  events: CalendarEvent[] = [
    this.currentEvent/*
    {
      title: 'Resizable event',
      //color: colors.yellow,
      start: new Date("2023-03-06 08:00:00"),
      end: addDays(new Date(), 1), // an end date is always required for resizable events to work
      resizable: {
        beforeStart: true, // this allows you to configure the sides the event is resizable from
        afterEnd: true,
      },
    }*/,
    {
      title: 'A non resizable event',
      //color: colors.blue,
      start: new Date("2023-03-06"),
      end: addDays(new Date(), 1),
    },
  ];
  constructor(public dialog: MatDialog) {
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

  openDialog(event : CalendarEvent): void {
    const dialogRef = this.dialog.open(EventDetails, {
      data: event,
    });
    event.start = new Date("2023-03-06 07:00:00")

    dialogRef.afterClosed().subscribe(result => {
      this.currentEvent=result;
      /*event.start = new Date(this.currentEvent.start);
      event.end = new Date(this.currentEvent.start);*/
      //event.start = new Date("2023-03-06 09:00:00")
      this.refresh.next();
      console.log('The dialog was closed'+this.currentEvent.end)});
      //event.start = new Date("2023-03-06"+this.currentEvent.start.getHours()+":00:00")
    //this.currentEvent.end=new Date("2023-03-06 15:00:00")
    this.refresh.next();
  }
  eventClicked({ event }: { event: CalendarEvent }): void {

    //event.start = new Date("2023-03-06 10:00:00")
    //event.end = new Date("2023-03-06 11:00:00")
    this.openDialog(event)

    this.refresh.next();
    console.log('Event clicked', event);
  }

  ngOnInit(): void {
    this.addNonWorkedDays(this.excludeDays)
  }

}
@Component({
  selector: 'event-details',
  templateUrl: 'event-details.html',
})
export class EventDetails {
  startDate: any;
  endDate: any;

  constructor(
    public dialogRef: MatDialogRef<EventDetails>,
    @Inject(MAT_DIALOG_DATA) public data: CalendarEvent,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeDate(): void {
    this.data.start= new Date(this.data.start.getFullYear()+"-"+
      (this.data.start.getMonth()+1)+"-"+this.data.start.getDate()+" "+this.startDate)
    console.log(this.endDate)
    //this.data.start = this.startDate
    this.data.end = new Date(this.data?.end?.getFullYear()+"-"+
      // @ts-ignore
      (this.data?.end?.getMonth()+1)+"-"+this.data?.end?.getDate()+" "+this.endDate)
  }
  getTimeAsString(date: Date) {
    return `${date.getHours()}:${(date.getMinutes() < 10 ? "0" : "") +
    date.getMinutes()}`;
  }


}
