import {Component, OnInit} from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {Category} from "../shared/interfaces";

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})
export class CategoriesPageComponent implements OnInit {

  isLoading = false;
  categories: Category[] = [];

  constructor(
    private categoriesService: CategoriesService
  ) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.categoriesService.getAllCategories()
      .subscribe((categories) => {
        this.isLoading = false;
        this.categories = categories;
        console.log(categories)
      });
  }
}
