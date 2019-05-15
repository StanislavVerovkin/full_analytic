import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from "../../../shared/services/positions.service";
import {MaterialInstance, MaterialService} from "../../../shared/helpers/material.service";
import {Position} from "../../../shared/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
  positionId = null;
  modal: MaterialInstance;
  form: FormGroup;

  constructor(private positionsService: PositionsService) {
  }

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost,
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    this.positionsService.deletePosition(position).subscribe(
      response => {
        const idx = this.positions.findIndex(p => p._id === position._id);
        this.positions.splice(idx, 1);
        MaterialService.toast(response.message);
      },
      error => {
        MaterialService.toast(error.error.message)
      }
    )
  }

  onAddPosition() {
    this.positionId = null;
    this.form.reset();
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    };

    const completed = () => {
      this.modal.close();
      this.form.reset();
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.updatePosition(newPosition)
        .subscribe(
          (position) => {
            const idx = this.positions.findIndex(p => p._id === position._id);
            this.positions[idx] = position;
            MaterialService.toast('Position updated');
          },
          (error) => {
            MaterialService.toast(error.error.message);
          },
          () => completed());
    } else {
      this.positionsService.createPosition(newPosition)
        .subscribe(
          (pos) => {
            MaterialService.toast('Position created');
            this.positions.push(pos);
          },
          (error) => {
            MaterialService.toast(error.error.message);
          },
          () => completed());
    }
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null,
        Validators.required
      ),
      cost: new FormControl(null, [
        Validators.required,
        Validators.min(1)
      ]),
    });

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
