import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { Palier, World } from '../world';
import { CommonModule } from '@angular/common';


export interface DialogData {
    data: World;
    server : string;
    type: string;
}

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.css',
    standalone: true,
    imports: [
      MatButtonModule,
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatDialogClose,
      CommonModule
    ],
  })
  export class DialogComponent {
    constructor(
      public dialogRef: MatDialogRef<DialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    onBuyManager(palier: Palier){
        this.notifyBuyManager.emit(palier);        
    }

    onBuyUpgrade(palier: Palier){
        this.notifyBuyUpgrade.emit(palier);
    }

    @Output() notifyBuyManager :
    EventEmitter<Palier> = new EventEmitter<Palier>();

    @Output() notifyBuyUpgrade :
    EventEmitter<Palier> = new EventEmitter<Palier>();
  }