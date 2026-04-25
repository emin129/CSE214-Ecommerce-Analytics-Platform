import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  standalone: false
})
export class ProductCardComponent implements OnChanges {
  @Input() product: any;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.validateProductImage();
    }
  }

  private validateProductImage(): void {
    if (!this.product.imageUrl ||
        this.product.imageUrl.includes('via.placeholder.com') ||
        this.product.imageUrl.trim() === '') {
      this.product.imageUrl = 'https://placehold.co/300x200?text=No+Image';
    }
  }

  setDefaultImage(event: any): void {
    event.target.src = 'https://placehold.co/300x200?text=Image+Not+Found';
  }

  onEdit(): void {
    this.edit.emit(this.product);
  }

  onDelete(): void {
    this.delete.emit(this.product);
  }
}
