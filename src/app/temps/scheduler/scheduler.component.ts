import {ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {lastValueFrom, Subject} from "rxjs";
import {addDays} from 'date-fns';
import {CalendarDateFormatter, CalendarEventTimesChangedEvent, CalendarView, DAYS_OF_WEEK,} from 'angular-calendar';
import {Utilisateur} from "../../interfaces/utilisateur";
import {CustomDateFormatter} from "./custom-date-formatter.provider";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {colors} from "./colors";
import * as moment from "moment";
import {now} from "moment";
import {SaisieService} from "./saisie.service";
import {JoursTravail} from "../../interfaces/jourTravail";
import {Saisie} from "../../interfaces/saisie";
import {SemaineTravail} from "../../interfaces/semaineTravail";
import {DatePipe} from "@angular/common";

function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
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
function getRightColor(typeSaisie : string){
  let couleur;
  if (typeSaisie == "Travail") {
    couleur = colors.blue
  } else {
    couleur = colors.yellow
  }
  return couleur;
}
function findIdJourByDate(semaine: SemaineTravail, date: string | null){
  let currentJour = {} as JoursTravail;
  for (const jour of semaine.joursTravail) {
    if (jour.date == date) {
      currentJour = jour;
    }
  }
  return currentJour;
}

let reponse: any;

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
  semaine={} as SemaineTravail;


  viewDate = new Date();
  // @ts-ignore
  currentEvent: Saisie = {
    title: 'Resizable event',
    color: colors.red,
    start: new Date("2023-03-06 08:00:00"),
    end: addDays(new Date(), 1), // an end date is always required for resizable events to work
    resizable: {
      beforeStart: true, // this allows you to configure the sides the event is resizable from
      afterEnd: true,
    },
  };

  events: Saisie[] = [];
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

  openDialog(event : Saisie): void {
    /*let pipe = new DatePipe('fr-FR');
    let eventDate = pipe.transform(event.end, 'yyyy-MM-dd')*/
    /*let idJour = this.findIdJourByDate(eventDate).idJourTravail*/
    // @ts-ignore

    // @ts-ignore

    event.username = this.user.username;
    event.semaineNb = this.semaine.numSemaine;
    event.semaine = this.semaine;
    //event.idJourTravail = this.findIdJourByDate(eventDate).idJourTravail
    console.log(event.idJourTravail)
    const dialogRef = this.dialog.open(EventDetails, {
      data: event,
    });


    // @ts-ignore
    dialogRef.afterClosed().subscribe(result => {
      this.refresh.next();
    });
      //event.start = new Date("2023-03-06"+this.currentEvent.start.getHours()+":00:00")
    //this.currentEvent.end=new Date("2023-03-06 15:00:00")
    this.refresh.next();
  }
  eventClicked({ event }: { event: Saisie }): void {
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
    } as Saisie
    this.openDialog(newEvent);
    this.events.push(newEvent)
    this.refresh.next();
  }

  generateAllStoredEvents(semaine: SemaineTravail){
    for (const semaineElement of semaine.joursTravail) {
      for (const jour of semaineElement.saisies) {
        this.events.push(this.generateStoredEvent(semaineElement.date, jour))
      }
    }
    this.refresh.next();
  }

  generateStoredEvent(date: string, saisie: Saisie ){
    let couleur = getRightColor(saisie.typeSaisie);
    return {
      title: saisie.typeSaisie,
      start: new Date(date + " " + saisie.heureDebut),
      end: new Date(date + " " +  saisie.heureFin),
      color: couleur,
      resizable: {
        beforeStart: true, // this allows you to configure the sides the event is resizable from
        afterEnd: true,
      },
      idJourTravail: saisie.idJourTravail,
      idSaisie: saisie.idSaisie,
      typeSaisie: saisie.typeSaisie,
      heureDebut: saisie.heureDebut,
      heureFin: saisie.heureFin,
    } as Saisie
  }




  async postSaisie(saisie: Saisie){
    await lastValueFrom(this.saisieService.postSaisie(reponse, saisie)).then(
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

  async ngOnInit(): Promise<void> {
    await this.addNonWorkedDays(this.excludeDays)
    await this.getTempsExist(this.user.username)
    await this.getWeekExist(this.user.username)
    this.generateAllStoredEvents(this.semaine)
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
  typeSaisie: String[] = ["Travail", "Pause"];
  selected: string = "";

  constructor(
    public dialogRef: MatDialogRef<EventDetails>,
    @Inject(MAT_DIALOG_DATA) public data: Saisie,
    public saisieService: SaisieService
  ) {
    this.startDate = this.data.start
    // @ts-ignore
    this.endDate = this.data.end
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  async postSaisie(saisie: Saisie){
    await lastValueFrom(this.saisieService.postSaisie(reponse, saisie)).then(
      (newSaisie) =>{
        this.data = newSaisie;
      }
    )
  }
  async createNewSaisie(saisie: Saisie){
    let pipe = new DatePipe('fr-FR');
    let eventDate = pipe.transform(this.endDate, 'yyyy-MM-dd')
    console.log(eventDate)
    saisie.idJourTravail = findIdJourByDate(saisie.semaine, eventDate).idJourTravail;
    saisie.title = this.selected;
    saisie.heureDebut = <string>pipe.transform(this.startDate, 'HH:mm:ss')
    saisie.heureFin = <string>pipe.transform(this.endDate, 'H:mm:ss')
    saisie.typeSaisie = this.selected;
    saisie.color = getRightColor(saisie.typeSaisie)
    await this.postSaisie(saisie);

    return saisie;
  }

  async changeDate() {
    this.data.start = this.startDate;
    this.data.end = this.endDate;
    this.data.typeSaisie = this.selected;
    this.data = await this.createNewSaisie(this.data)
    console.log(this.data)

    /*this.data.start= new Date(this.data.start.getFullYear()+"-"+
      (this.data.start.getMonth()+1)+"-"+this.data.start.getDate()+" "+this.startDate)
    console.log(this.endDate)
    //this.data.start = this.startDate
    this.data.end = new Date(this.data?.end?.getFullYear()+"-"+
      // @ts-ignore
      (this.data?.end?.getMonth()+1)+"-"+this.data?.end?.getDate()+" "+this.endDate)*/
  }


}
