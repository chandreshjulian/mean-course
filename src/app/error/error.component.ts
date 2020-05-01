import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './error.component.html',
})
export class ErrorComponent {
  // message = 'An unknown error occurred!';
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}

/**
 * this is the way through @Inject you can dynamically pass the data to the component
 */
