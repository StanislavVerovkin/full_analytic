import {Injectable} from '@angular/core';
import {OrderPosition, Position} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class PrepareOrderService {

  list: OrderPosition[] = [];
  price = 0;

  add(position: Position) {

    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id,
    });

    const searchAddedItem = this.list.find(p => p._id === orderPosition._id);

    if (searchAddedItem) {
      searchAddedItem.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }
    this.computedPrice();
  }

  remove(orderPosition: OrderPosition) {
    const idx = this.list.findIndex(p => p._id === orderPosition._id);
    this.list.splice(idx, 1);
    this.computedPrice();
  }

  clear() {
    this.list = [];
    this.price = 0;
  }

  private computedPrice() {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0)
  }
}
