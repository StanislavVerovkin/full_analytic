import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from "../shared/helpers/material.service";
import {OrderService} from "../shared/services/order.service";
import {Order} from "../shared/interfaces";

const STEP = 2;

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

  offset = 0;
  limit = STEP;

  constructor(
    private orderService: OrderService
  ) {
  }

  ngOnInit() {
    this.getRequest();
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initToltip(this.tooltipRef);
  }

  ngOnDestroy() {
    this.tooltip.destroy();
  }

  private getRequest() {
    const params = {
      offset: this.offset,
      limit: this.limit,
    };
    this.orderService.getListOfOrders(params).subscribe(
      orders => {
        console.log(orders);
        this.orders = orders;
      }
    )
  }
}
