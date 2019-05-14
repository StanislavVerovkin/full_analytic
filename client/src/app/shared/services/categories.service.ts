import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Category} from "../interfaces";
import {Observable} from "rxjs/internal/Observable";
import {st} from "@angular/core/src/render3";

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/category');
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/category/${id}`);
  }

  createCategory(name: string, image?: File): Observable<Category> {

    const fd = new FormData();
    if (image) {
      fd.append('image', image, image.name);
    }
    fd.append('name', name);

    return this.http.post<Category>('/api/category', fd);
  }

  updateCategory(id: string, name: string, image?: File): Observable<Category> {

    const fd = new FormData();
    if (image) {
      fd.append('image', image, image.name);
    }
    fd.append('name', name);

    return this.http.patch<Category>(`/api/category/${id}`, fd);
  }
}
