import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'], // Make sure to link your new CSS here!
  standalone: false
})
export class AddProductComponent implements OnInit {
  form!: FormGroup;

  // Array to hold real categories from the database
  categoryOptions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1. Initialize Form with English keys and validation
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      category: [null, Validators.required] // Send category as an object
    });

    // 2. Fetch real Kaggle categories on load
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categoryOptions = data; // Now contains real Kaggle categories
      },
      error: () => console.error('Failed to load dynamic categories.')
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      // 3. The service already includes the Bearer token thanks to getHeaders()
      this.productService.create(this.form.value).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.router.navigate(['/seller']);
        },
        error: (err) => {
          console.error(err);
          alert('Error: Could not add product. Check your token or permissions.');
        }
      });
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
