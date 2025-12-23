import { Component, ViewChild, OnInit, inject } from '@angular/core';

import { ApiService, TimingParams, EventParams, SimpleText } from './shared/api.service';
import { TBOManager } from './shared/bo.service';

import { ConnectionControlComponent } from './connection-control/connection-control.component';
import { TimingButtonsComponent } from './timing-buttons/timing-buttons.component';
import { FrSelectRaceComponent } from './fr-select-race/fr-select-race.component';
import { FrSelectTimepointComponent } from './fr-select-timepoint/fr-select-timepoint.component';
import { FrTableComponent } from './fr-table/fr-table.component';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    ConnectionControlComponent,
    TimingButtonsComponent,
    FrSelectRaceComponent,
    FrSelectTimepointComponent,
    FrTableComponent,
    JsonPipe,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild(ConnectionControlComponent, { static: true }) connectionControl!: ConnectionControlComponent;

  @ViewChild(FrTableComponent, { static: true }) frTable!: FrTableComponent;

  @ViewChild('timingTab', { static: true })
  timingTab!: TimingButtonsComponent;

  auto = true;
  wantUpdateEvent = true;

  InputMsgText1 = '';
  InputMsgText2 = '';

  race = 1;
  timepoint = 0;
  bib = 1;

  time = '';
  status = '';

  mode = 0;
  modes = ['narrow', 'wide', 'finish', 'points'];

  option = 0;
  options = ['time/finish', 'dns', 'dnf', 'dsq', 'ok', 'erase'];

  resultCounter = 0;
  errorFormatString = 'Error in onKeyClick() - Error code: %s, URL: %s ';

  simpleText: string[] = ['abc', 'def'];

  private apiService = inject(ApiService);
  public BOManager = inject(TBOManager);

  constructor() {}

  ngOnInit(): void {
    this.connectionControl.queryBtnClick();
  }

  onParamsChanged(value: EventParams): void {
    this.BOManager.recreate(value.raceCount, value.itCount, value.startlistCount);
    this.reset();
    this.tableBtnClick();
  }

  onRaceChanged(value: number): void {
    this.clearLabels();
    this.race = value;
    if (this.timingTab) {
      this.timingTab.race = value;
    }
    this.tableBtnClick();
  }

  onTimePointChanged(value: number): void {
    this.clearLabels();
    this.timepoint = value;
    if (this.timingTab) {
      this.timingTab.timepoint = value;
    }
    this.tableBtnClick();
  }

  onBibChanged(value: number): void {
    const t: TimingParams = {
      race: this.race,
      tp: this.timepoint,
      bib: value,
    };
    this.onTimeReceived(t);
  }

  tableBtnClick(): void {
    switch (this.mode) {
      case 0:
        this.apiService.getNarrowRaceTableJson(this.race, this.timepoint).subscribe(
          (data: string) => this.onResultAvailable(data),
          (err: any) => console.log(this.errorFormatString, err.status, err.url),
        );
        break;
      case 1:
        this.apiService.getWideRaceTableJson(this.race, this.bib).subscribe(
          (data: string) => this.onResultAvailable(data),
          (err: any) => console.log(this.errorFormatString, err.status, err.url),
        );
        break;
      case 2:
        this.apiService.getFinishTableJson().subscribe(
          (data: string) => this.onResultAvailable(data),
          (err: any) => console.log(this.errorFormatString, err.status, err.url),
        );
        break;

      case 3:
        this.apiService.getPointsTableJson().subscribe(
          (data: string) => this.onResultAvailable(data),
          (err: any) => console.log(this.errorFormatString, err.status, err.url),
        );
        break;

      default:
    }
  }

  onResultAvailable(value: string): void {
    this.resultCounter++;
    this.frTable.initTable(value);
  }

  onTimeReceived(tm: TimingParams): void {
    this.triggerTimingEvent(tm);
    this.onTimeReceivedLocal(tm);
  }

  triggerTimingEvent(tm: TimingParams): void {
    if (this.connectionControl.getConnected()) {
      if (this.auto) {
        this.apiService
          .getTimingEventForTable(tm.race, tm.tp, tm.bib, this.option, this.mode)
          .subscribe({
            next: (data: string) => this.onResultAvailable(data),
            error: (err: any) => console.log(this.errorFormatString, err.status, err.url),
          });
      }
    }
  }

  onTimeReceivedLocal(tm: TimingParams): void {
    this.InputMsgText1 = '';
    this.InputMsgText2 = '';

    const cr = this.BOManager.BO.findBib(tm.bib);
    if (!cr) {
      return;
    }
    const raceEntry = cr.Race[tm.race];
    if (!raceEntry) {
      return;
    }
    const timeEntry = raceEntry.IT[tm.tp];
    if (!timeEntry) {
      return;
    }

    const time = this.getTimeString(2);

    let mt = 0;
    let qu = '';

    switch (this.option) {
      case 1:
        mt = 1;
        qu = 'dns';
        break;
      case 2:
        mt = 2;
        qu = 'dnf';
        break;
      case 3:
        mt = 3;
        qu = 'dsq';
        break;
      case 4:
        mt = 4;
        qu = 'ok';
        break;
    }

    const erase = this.option === 5;

    let te: string;
    let tr: string;
    if (mt > 0) {
      tr = 'FR.*.W' + tm.race + '.Bib' + tm.bib + '.QU' + ' = ' + qu;
      te = tr;
      raceEntry.QU = qu;
    } else if (erase) {
      te = 'FR.*.W' + tm.race + '.Bib' + tm.bib + '.RV=0';
      tr = 'FR.*.W' + tm.race + '.Bib' + tm.bib + '.IT' + tm.tp + ' = -1';
      timeEntry.Time = '';
    } else {
      te = 'FR.*.W' + tm.race + '.Bib' + tm.bib + '.RV=500';
      tr = 'FR.*.W' + tm.race + '.Bib' + tm.bib + '.IT' + tm.tp + ' = ' + time;
      timeEntry.Time = time;
    }

    if (te === tr) {
      te = '';
    }
    if (this.timepoint > 0) {
      te = '';
    }

    this.InputMsgText1 = tr;
    this.InputMsgText2 = te;

    this.option = 0;
    this.bib = tm.bib;
    this.time = timeEntry.Time;
    this.status = raceEntry.QU;
  }

  onTimeCancelled(tm: TimingParams): void {
    this.InputMsgText1 = '';
    this.InputMsgText2 = '';

    const cr = this.BOManager.BO.findBib(tm.bib);
    if (!cr) {
      return;
    }
    const raceEntry = cr.Race[tm.race];
    if (!raceEntry) {
      return;
    }
    const timeEntry = raceEntry.IT[tm.tp];
    if (!timeEntry) {
      return;
    }

    this.bib = tm.bib;
    this.InputMsgText1 = timeEntry.Time || 'no time';
    this.InputMsgText2 = raceEntry.QU;
  }

  updateFabs(): void {
    if (this.timingTab) {
      this.timingTab.update();
    }
  }

  /**
   * generate time string from new Date()
   * (duplicate) of similar method TRaceBO.getTime()
   * @returns string in format HH:mm:ss.fff
   */
  getTimeString(digits = 2): string {
    const d = new Date();
    const hh = d.getHours();
    const mm = d.getMinutes();
    const ss = d.getSeconds();
    const t = d.getMilliseconds();

    const shh = '' + hh;
    const smm = mm < 10 ? '0' + mm : mm;
    const sss = ss < 10 ? '0' + ss : ss;
    let sms = '' + t;
    if (t < 10) {
      sms = '00' + t;
    } else if (t < 100) {
      sms = '0' + t;
    }

    switch (digits) {
      case 1:
        sms = sms.substring(0, 1);
        break;
      case 2:
        sms = sms.substring(0, 2);
        break;
    }

    const tm = shh + ':' + smm + ':' + sss + '.' + sms;
    return tm;
  }

  triggerBtnClick(): void {
    this.onBibChanged(this.bib);
    this.updateFabs();
  }

  clearBtnClick(): void {
    this.BOManager.BO.clear();
    this.reset();
  }

  resetBtnClick(): void {
    const ep = new EventParams();
    ep.raceCount = 2;
    ep.itCount = 2;
    ep.startlistCount = 8;
    this.onParamsChanged(ep);
  }

  smallBtnClick(): void {
    const ep = new EventParams();
    ep.raceCount = 1;
    ep.itCount = 0;
    ep.startlistCount = 6;
    this.onParamsChanged(ep);
  }

  bigBtnClick(): void {
    const ep = new EventParams();
    ep.raceCount = 3;
    ep.itCount = 3;
    ep.startlistCount = 12;
    this.onParamsChanged(ep);
  }

  clearLabels(): void {
    this.time = '';
    this.status = '';

    this.InputMsgText1 = 'InputMsgText1';
    this.InputMsgText2 = 'InputMsgText2';

    this.option = 0;
    this.resultCounter = 0;
  }

  reset(): void {
    this.clearLabels();
    this.race = 1;
    this.timepoint = 0;
    this.bib = 1;
    this.updateFabs();
  }

  onClearRaceCommand(value: number) {
    this.BOManager.BO.clearRace(this.race);
    this.clearLabels();
    this.updateFabs();
    if (this.connectionControl.getConnected()) {
      this.apiService.manageClearRace(this.race).subscribe(
        (data) => this.handleSuccess(data),
        (err) => this.handleError(err),
      );
    }
  }

  onClearTimepointCommand(value: number) {
    this.BOManager.BO.clearTimepoint(this.race, this.timepoint);
    this.clearLabels();
    this.updateFabs();
    if (this.connectionControl.getConnected()) {
      this.apiService.manageClearTimepoint(this.race, this.timepoint).subscribe(
        (data) => this.handleSuccess(data),
        (err) => this.handleError(err),
      );
    }
  }

  handleError(err: any): void {
    this.connectionControl.setConnected(false);
    console.log(this.errorFormatString, err.status, err.url);
  }

  handleSuccess(data: string): void {
    this.tableBtnClick();
  }

  jsonBtnClick(): void {
    this.apiService.getSimpleText().subscribe({
      next: (data: SimpleText) => this.onSimpleDataAvailable(data.EventDataSimpleText),
      error: (e: any) => console.log(this.errorFormatString, e.status, e.url),
    });
  }

  onSimpleDataAvailable(st: string[]): void {
    this.simpleText = st;
    this.BOManager.processBackup(st);
    this.updateFabs();
  }
}
