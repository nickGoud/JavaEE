import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from './generic-http.service';
import { Vendor } from './vendor/vendor';
@Injectable({
  providedIn: 'root',
})
export class NewVendorService extends GenericHttpService<Vendor> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `vendors`);
  } // constructor
} // NewVendorService
