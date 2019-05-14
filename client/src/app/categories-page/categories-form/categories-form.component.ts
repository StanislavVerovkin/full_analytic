import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs/internal/observable/of";
import {MaterialService} from "../../shared/helpers/material.service";
import {Category, Message} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef: ElementRef;
  isNew = true;
  form: FormGroup;
  image: File;
  imagePreview: '';
  category: Category;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.categoriesService.getCategoryById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe(
        (category) => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name
            });
            MaterialService.updateTextInputs();
            this.imagePreview = category.imageSrc;
          }
          this.form.enable();
        },
        (error) => MaterialService.toast(error.error.message)
      )
  }

  triggerClick() {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.createCategory(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.updateCategory(this.category._id, this.form.value.name, this.image);
    }
    obs$.subscribe(
      category => {
        this.category = category;
        this.form.enable();
        MaterialService.toast('Changes save')
      },
      error => {
        MaterialService.toast(error.error.message);
        this.form.enable();

      }
    )
  }

  onRemove() {
    this.categoriesService.removeCategory(this.category._id)
      .subscribe((message: Message) => {
        MaterialService.toast(message.message);
        this.router.navigate(['/categories']);
      })
  }
}
