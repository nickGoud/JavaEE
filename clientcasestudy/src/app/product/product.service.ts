import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '../generic-http.service';
import { Product } from './product';
@Injectable({
  providedIn: 'root',
})
export class ProductService extends GenericHttpService<Product> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `products`);
  } // constructor
} // ProductService
