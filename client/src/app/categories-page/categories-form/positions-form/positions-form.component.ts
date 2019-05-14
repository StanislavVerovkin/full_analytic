import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.setvice";
import {MaterialInstance, MaterialService} from "../../../shared/helpers/material.service";

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;

  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;

  constructor(
    private positionsService: PositionsService
  ) {
  }

  onSelectPosition(position: Position) {
    this.modal.open();
  }

  onAddPosition() {
    this.modal.open();
  }

  onCancel() {
    this.modal.close();
  }

  ngOnInit() {
    this.loading = true;
    this.positionsService.getPositionsByCategoryId(this.categoryId)
      .subscribe((positions) => {
        this.positions = positions;
        this.loading = false;
      })
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }
}
