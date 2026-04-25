import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  standalone: false
})
export class EditProductComponent implements OnInit {
  form!: FormGroup;
  productId!: number;
  categoryOptions: any[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
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
      next: (data) => { this.categoryOptions = data; },
      error: (err) => console.error('Kategoriler yüklenemedi:', err)
    });
  }

  loadProductDetails(): void {
    this.isLoading = true;
    this.productService.getById(this.productId).subscribe({
      next: (product) => {
        this.form.patchValue(product);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ürün detay hatası:', err);
        this.isLoading = false;
      }
    });
  }

  // KRİTİK: Mevcut kategorinin seçili gelmesini sağlayan metod
  compareCategories(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.productService.update(this.productId, this.form.value).subscribe({
        next: () => {
          alert('Asset successfully updated in repository.');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => alert('Update failed. Check console for details.')
      });
    }
  }
}
