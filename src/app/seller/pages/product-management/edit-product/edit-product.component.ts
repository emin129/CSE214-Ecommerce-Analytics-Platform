import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  standalone: false
})
export class EditProductComponent implements OnInit {
  form!: FormGroup;
  productId!: number;
  categoryOptions: any[] = []; // Dynamic categories

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      category: [null, Validators.required]
    });

    this.loadCategories();
    this.loadProductDetails();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => this.categoryOptions = data,
      error: () => console.error('Failed to load categories')
    });
  }

  loadProductDetails(): void {
    this.productService.getById(this.productId).subscribe({
      next: (product) => {
        // Backend'den gelen veriyi forma basar
        this.form.patchValue(product);
      },
      error: () => alert('Failed to load product details.')
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.productService.update(this.productId, this.form.value).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.router.navigate(['/seller']);
        },
        error: () => alert('Failed to update product.')
      });
    }
  }
}
