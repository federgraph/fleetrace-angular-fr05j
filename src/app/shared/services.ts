import { ApiService } from './api.service';
import { TBOManager } from './bo.service';
import {TableService } from './table.service';

export const ONLINE_SERVICES = [
  ApiService,
  TBOManager,
  TableService
];
