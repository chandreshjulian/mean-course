import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  exports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
  ],
})
export class AngularMaterialModule {}
