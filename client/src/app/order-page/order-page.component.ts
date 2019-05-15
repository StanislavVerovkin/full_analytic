import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {MaterialInstance, MaterialService} from "../shared/helpers/material.service";
import {PrepareOrderService} from "../shared/services/prepare-order.service";
import {Order, OrderPosition} from "../shared/interfaces";
import {OrderService} from "../shared/services/order.service";

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;
  isRoot: boolean;
  modal: MaterialInstance;
  pending = false;

  constructor(
    private router: Router,
    public order: PrepareOrderService,
    private orderService: OrderService,
  ) {
  }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  onOpenModal() {
    this.modal.open();
  }

  onCloseModal() {
    this.modal.close();
  }

  onSubmit() {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.orderService.createOrder(order)
      .subscribe(
        data => {
          MaterialService.toast(`Order ${data.order} was added`);
          this.order.clear();
        },
        error => MaterialService.toast(error.error.message),
        () => {
          this.modal.close();
          this.pending = false;
        }
      )
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  }
}
