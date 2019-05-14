import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Position} from "../interfaces";

@Injectable({
  providedIn: 'root'
})

export class PositionsService {

  constructor(
    private http: HttpClient
  ) {
  }

  getPositionsByCategoryId(categoryId: string): Observable<Position[]> {
    return this.http.get<Position[]>(`/api/position/${categoryId}`);
  }
}
