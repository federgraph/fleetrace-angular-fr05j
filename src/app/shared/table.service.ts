import { Injectable } from '@angular/core';

export class ResultHeaderCell {
  upchar = String.fromCharCode(160, 9650);
  downchar = String.fromCharCode(160, 9660);
  spacechar = ' ';

  i: number;
  c: string;
  v: string;
  s: string;
  b: boolean;

  constructor(aIndex: number, aClass: string, aValue: string) {
    this.i = aIndex;
    this.c = aClass;
    this.v = aValue;
    this.s = '';
    this.b = false;
  }

  clear() {
    this.b = false;
    this.s = this.spacechar;
  }

  swap() {
    this.b = !this.b;
    if (this.b) {
      this.s = this.upchar;
    } else {
      this.s = this.downchar;
    }
  }
}

export class ResultTableCell {
  c: string;
  v: string;
  constructor(aClass: string, aValue: string) {
    this.c = aClass;
    this.v = aValue;
  }
}

export class ResultTableRow {
  cols: Array<ResultTableCell> = [];

  add(c: string, v: string) {
    const cr = new ResultTableCell(c, v);
    this.cols.push(cr);
  }
}

export class ResultTable {
  head!: ResultTableRow;
  body!: ResultTableRow[];
  index!: number[][];

  clearBody() {
    this.body = new Array<ResultTableRow>();
  }

  initFleetTest() {
    let tr;
    tr = new ResultTableRow();
    tr.add('h', 'ID');
    tr.add('h', 'SNR');
    tr.add('h', 'Bib');
    tr.add('h', 'DN');
    tr.add('h', 'NC');
    tr.add('h', 'R1');
    tr.add('h', 'R2');
    tr.add('h', 'Total');
    tr.add('h', 'Rank');
    this.head = tr;

    this.clearBody();

    tr = new ResultTableRow();
    tr.add('a', '1');
    tr.add('ae', '1001');
    tr.add('ae', '1');
    tr.add('al', '');
    tr.add('ae', '');
    tr.add('g1', '1');
    tr.add('g2', '1');
    tr.add('a', '2.0');
    tr.add('a', '1');
    this.body.push(tr);

    tr = new ResultTableRow();
    tr.add('n', '2');
    tr.add('e', '1002');
    tr.add('e', '2');
    tr.add('nl', '');
    tr.add('e', '');
    tr.add('g1', '3');
    tr.add('g2', '2');
    tr.add('n', '5.0');
    tr.add('n', '4');
    this.body.push(tr);

    tr = new ResultTableRow();
    tr.add('a', '3');
    tr.add('ae', '1003');
    tr.add('ae', '3');
    tr.add('al', '');
    tr.add('ae', '');
    tr.add('g1', '2');
    tr.add('g2', '4');
    tr.add('a', '6.0');
    tr.add('a', '5');
    this.body.push(tr);

    tr = new ResultTableRow();
    tr.add('n', '4');
    tr.add('e', '1004');
    tr.add('e', '4');
    tr.add('nl', '');
    tr.add('e', '');
    tr.add('g1', '4');
    tr.add('g2', '5');
    tr.add('n', '7.0');
    tr.add('n', '7');
    this.body.push(tr);

    tr = new ResultTableRow();
    tr.add('a', '5');
    tr.add('ae', '1005');
    tr.add('ae', '5');
    tr.add('al', '');
    tr.add('ae', '');
    tr.add('g2', '4');
    tr.add('g1', '4');
    tr.add('a', '8.0');
    tr.add('a', '8');
    this.body.push(tr);

    tr = new ResultTableRow();
    tr.add('n', '6');
    tr.add('e', '1006');
    tr.add('e', '6');
    tr.add('nl', '');
    tr.add('e', '');
    tr.add('g2', '3');
    tr.add('g1', '3');
    tr.add('n', '6.0');
    tr.add('n', '6');
    this.body.push(tr);

    tr = new ResultTableRow();
    tr.add('a', '7');
    tr.add('ae', '1007');
    tr.add('ae', '7');
    tr.add('al', '');
    tr.add('ae', '');
    tr.add('g2', '2');
    tr.add('g1', '2');
    tr.add('a', '4.0');
    tr.add('a', '3');
    this.body.push(tr);

    tr = new ResultTableRow();
    tr.add('n', '8');
    tr.add('e', '1008');
    tr.add('e', '8');
    tr.add('nl', '');
    tr.add('e', '');
    tr.add('g2', '1');
    tr.add('g1', '1');
    tr.add('n', '2.0');
    tr.add('n', '1');
    this.body.push(tr);

    const indexTable = [
      [1, 1, 1, 1, 1, 1, 8, 1, 8],
      [2, 2, 2, 2, 2, 3, 7, 8, 1],
      [3, 3, 3, 3, 3, 2, 6, 7, 7],
      [4, 4, 4, 4, 4, 4, 5, 2, 2],
      [5, 5, 5, 5, 5, 8, 1, 3, 3],
      [6, 6, 6, 6, 6, 7, 2, 6, 6],
      [7, 7, 7, 7, 7, 6, 4, 4, 4],
      [8, 8, 8, 8, 8, 5, 3, 5, 5],
    ];
    this.index = indexTable;
  }
}

@Injectable()
export class TableService {
  fleetTest: ResultTable;

  constructor() {
    this.fleetTest = new ResultTable();
    this.fleetTest.initFleetTest();
  }

  getFleetTestJson() {
    return JSON.stringify(this.fleetTest);
  }
}
