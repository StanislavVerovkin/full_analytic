import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PositionsService} from "../../shared/services/positions.service";
import {Observable} from "rxjs/internal/Observable";
import {Position} from "../../shared/interfaces";
import {switchMap} from "rxjs/operators";
import {PrepareOrderService} from "../../shared/services/prepare-order.service";
import {MaterialService} from "../../shared/helpers/material.service";

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>;

  constructor(
    private route: ActivatedRoute,
    private positionsService: PositionsService,
    private orderService: PrepareOrderService,
  ) {
  }

  ngOnInit() {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            return this.positionsService.getPositionsByCategoryId(params['id']);
          }
        )
      )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Added ${position.quantity} items`);
    this.orderService.add(position);
  }
}
