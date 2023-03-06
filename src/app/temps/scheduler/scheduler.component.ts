import {ChangeDetectionStrategy, Component, Inject, Input, OnInit, Pipe, ViewEncapsulation} from '@angular/core';
import {async, lastValueFrom, Subject} from "rxjs";
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
import { EventColor } from 'calendar-utils';
import {colors} from "./colors";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import * as moment from "moment";
import {now} from "moment";
import {SaisieService} from "./saisie.service";
import {JoursTravail} from "../../interfaces/jourTravail";
import {Saisie} from "../../interfaces/saisie";
import {SemaineTravail} from "../../interfaces/semaineTravail";
import {DatePipe} from "@angular/common";


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

  lastSaisie={} as Saisie;
  currentWeek: number = moment(now()).isoWeek();

  clickedColumn: number = 0;
  reponse: any;
  semaine={} as SemaineTravail;

  viewDate = new Date();
  // @ts-ignore
  currentEvent: CalendarEvent = {
    title: 'Resizable event',
    color: colors.red,
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
  constructor(public dialog: MatDialog, public saisieService: SaisieService/*, private datePipe: DatePipe*/) {
    // @ts-ignore
    this.user= {departements: [], email: "", idUtilisateur: "", nom: "", prenom: "", temps: undefined, username: ""};

  }


  weekStartsOn = DAYS_OF_WEEK.SUNDAY;

  CalendarView = CalendarView;

  refresh = new Subject<void>();
  panelOpenState: boolean = false;
  dateControl: any;

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

    dialogRef.afterClosed().subscribe(result => {
      this.refresh.next();
    });
      //event.start = new Date("2023-03-06"+this.currentEvent.start.getHours()+":00:00")
    //this.currentEvent.end=new Date("2023-03-06 15:00:00")
    this.refresh.next();
  }
  eventClicked({ event }: { event: CalendarEvent }): void {
    this.openDialog(event)

    this.refresh.next();
    console.log('Event clicked', event);
  }

  createEvent(/*startDate: Date, endDate: Date, name: string, typeSaisie*/) {
    let nowPlusOne = moment(now()).add(1,'hour')
    let newEvent =  {
        title: 'Resizable event',
        //color: colors.yellow,
        start : new Date(moment(now()).toDate()),
        end : new Date(nowPlusOne.toDate()),
        /*start: startDate,
        end: endDate, // an end date is always required for resizable events to work*/
        resizable: {
          beforeStart: true, // this allows you to configure the sides the event is resizable from
          afterEnd: true,
        }
    } as CalendarEvent
    this.openDialog(newEvent);
    this.events.push(newEvent)
    this.refresh.next();
  }

  async postSaisie(semaineNb:number, jourTravail: JoursTravail, saisie: Saisie){
    await lastValueFrom(this.saisieService.postUsername(this.reponse, this.user.username, semaineNb, jourTravail, saisie)).then(
      (newSaisie) =>{
        this.lastSaisie = newSaisie;
      }
    )
  }
  async getTempsExist(username: string){
    await lastValueFrom(this.saisieService.getTempsExist(username)).then(
      (newUser)=>{
        this.user = newUser;
      }
    )
  }
  async getWeekExist(username: string){
    let current = moment(now()).toDate().toISOString();
    let pipe = new DatePipe('fr-FR');
    let newDate = pipe.transform(current, 'yyyy-MM-dd')

    // @ts-ignore
    await lastValueFrom(this.saisieService.getWeekExist(username, newDate.toString())).then(
      (newSemaine)=>{
        this.semaine = newSemaine;
      }
    )
  }

  ngOnInit(): void {
    this.addNonWorkedDays(this.excludeDays)
    console.log(this.currentWeek)
    console.log(moment("2023-03-03T17:44:56.144")/*.startOf("week")*/.isoWeek())
    this.getTempsExist(this.user.username)
    this.getWeekExist(this.user.username)
    /*console.log(moment(now()).get());*/
  }

}
/**
 *  DIALOG!!!
 **/
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
  ) {
    this.startDate = this.data.start
    // @ts-ignore
    this.endDate = this.data.end
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeDate(): void {
    this.data.start = this.startDate;
    this.data.end = this.endDate;

    /*this.data.start= new Date(this.data.start.getFullYear()+"-"+
      (this.data.start.getMonth()+1)+"-"+this.data.start.getDate()+" "+this.startDate)
    console.log(this.endDate)
    //this.data.start = this.startDate
    this.data.end = new Date(this.data?.end?.getFullYear()+"-"+
      // @ts-ignore
      (this.data?.end?.getMonth()+1)+"-"+this.data?.end?.getDate()+" "+this.endDate)*/
  }


}
