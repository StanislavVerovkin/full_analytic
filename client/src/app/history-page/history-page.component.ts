import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/helpers/material.service";
import {OrderService} from "../shared/services/order.service";
import {Filter, Order} from "../shared/interfaces";

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef;

  tooltip: MaterialInstance;
  isFilterVisible = false;
  orders: Order[] = [];
  filter: Filter = {};

  offset = 0;
  limit = 2;

  loading = false;
  reloading = false;
  noMoreOrders = false;

  constructor(
    private orderService: OrderService
  ) {
  }

  ngOnInit() {
    this.reloading = true;
    this.getRequest();
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy() {
    this.tooltip.destroy();
  }

  loadMore() {
    this.offset += this.limit;
    this.loading = true;
    this.getRequest();
  }

  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.reloading = true;
    this.filter = filter;
    this.getRequest();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }

  private getRequest() {

    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit,
    });

    this.orderService.getListOfOrders(params).subscribe(
      orders => {
        this.orders = this.orders.concat(orders);
        this.noMoreOrders = orders.length < this.limit;
        this.loading = false;
        this.reloading = false;
      }
    )
  }
}
