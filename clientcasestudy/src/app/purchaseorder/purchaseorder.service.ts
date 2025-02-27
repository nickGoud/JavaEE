import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Purchaseorder } from './purchaseorder';
import { GenericHttpService } from '../generic-http.service';

@Injectable({
  providedIn: 'root',
})
export class PurchaseorderService extends GenericHttpService<Purchaseorder> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `purchaseorders`);
  } // constructor
} // NewEmployeeService
