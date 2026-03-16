import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: false
})
export class AddProductComponent implements OnInit {
  form!: FormGroup;

  // Dynamic categories from Kaggle/Database
  categoryOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      imageUrl: [''],
      category: [null, Validators.required]
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categoryOptions = data;
      },
      error: () => console.error('Failed to load categories from database.')
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.productService.create(this.form.value).subscribe({
        next: () => {
          alert('Product created successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          if (err.status === 403) {
            alert('Access denied. Please login with Admin credentials.');
          } else {
            alert('An error occurred while creating the product.');
          }
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
