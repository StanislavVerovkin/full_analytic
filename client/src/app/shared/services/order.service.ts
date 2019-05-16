import {Injectable} from '@angular/core';
import {Order} from "../interfaces";
import {Observable} from "rxjs/internal/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private order: OrderService,
    private http: HttpClient
  ) {
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>('/api/order', order);
  }

  getListOfOrders(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('/api/order', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }
}
