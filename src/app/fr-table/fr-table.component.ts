import { Component, OnInit } from '@angular/core';

import {
  TableService,
  ResultTable,
  ResultTableRow,
  ResultHeaderCell
} from '../shared/table.service';

@Component({
  selector: 'app-fr-table',
  styleUrls: ['./fr-table.component.css'],
  templateUrl: './fr-table.component.html'
})
export class FrTableComponent implements OnInit {

  resultTable: ResultTable;
  resultTableJson: string;
  currentHeaderCell: ResultHeaderCell;
  currentColumn: number;
  currentIndex: Array<number>;
  resultTableBody: Array<ResultTableRow>;
  resultTableHeader: Array<ResultHeaderCell>;
  selectedRow: number = -1;

  constructor(private dataService: TableService) {
  }

  ngOnInit() {
    const s = JSON.stringify(this.dataService.fleetTest);
    this.initTable(s);
  }

  initTable(netto: string) {
    this.resultTable = JSON.parse(netto);
    this.resultTableJson = netto;

    this.resultTableHeader = [];
    const l = this.resultTable.head.cols.length;
    for (let i = 0; i < l; i++) {
      const rhc = new ResultHeaderCell(i,
        this.resultTable.head.cols[i].c,
        this.resultTable.head.cols[i].v);
      this.resultTableHeader.push(rhc);
    }

    this.headerClick(this.resultTableHeader[0]);
  }

  headerClick(cell: ResultHeaderCell) {
    if (this.currentHeaderCell && cell !== this.currentHeaderCell) {
      this.currentHeaderCell.clear();
    }
    cell.swap();
    this.currentHeaderCell = cell;

    const r = 0;
    const c = cell.i;
    this.currentColumn = c;

    let a: number;
    const aa = Array<number>();
    const st = Array<ResultTableRow>();
    const l = this.resultTable.index.length;
    for (let i = 0; i < l; i++) {
      if (cell.b) {
        a = this.resultTable.index[i][c];
      } else {
        a = this.resultTable.index[l - 1 - i][c];
      }
      aa.push(a);
      st.push(this.resultTable.body[a - 1]);
    }
    this.currentIndex = aa;
    this.resultTableBody = st;
  }

  setClickedRow(i: number) {
    this.selectedRow = i;
  }

  setTable(netto: string) {
    this.initTable(netto);
  }

}
