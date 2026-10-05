import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular';
import { Product, ProductsResponse } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]
})
export class ProductosPage implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  total = 0;
  loading = false;
  error = '';
  message = '';

  ngOnInit(): void {
    this.loadProducts();
  }

  // HTTP GET: Cargar productos
  loadProducts(): void {
    this.loading = true;
    this.error = '';
    this.message = '';

    this.productService.getProducts()
      .subscribe({
        next: (response: ProductsResponse) => {
          this.products = response.products;
          this.total = response.total;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(error);
          this.error = 'No se han podido cargar los productos.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  // Cálculo del Stock Valorado: unidades * (precio - descuento)
  calculateValuedStock(product: Product): number {
    const discountedPrice = product.price * (1 - (product.discountPercentage || 0) / 100);
    return product.stock * discountedPrice;
  }



  // HTTP PUT: Actualizar un producto
  onUpdateProduct(product: Product): void {
    const updatedData: Partial<Product> = {
      title: `${product.title} (Actualizado)`,
      price: Math.round(product.price * 0.9 * 100) / 100
    };

    this.productService.updateProduct(product.id, updatedData).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === product.id);
        if (index !== -1) {
          this.products[index] = { ...this.products[index], ...updatedProduct };
        }
        this.message = `[PUT] Producto ${product.id} actualizado correctamente.`;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al actualizar producto';
        this.cdr.markForCheck();
      }
    });
  }

  // HTTP DELETE: Eliminar un producto
  onDeleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
        this.message = `[DELETE] Producto ${id} eliminado correctamente.`;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al eliminar producto';
        this.cdr.markForCheck();
      }
    });
  }
}
