import {Component, Inject} from '@angular/core';
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
    unlock : Palier = new Palier();
    constructor(
      public dialogRef: MatDialogRef<DialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    getUnlocks(){
      let unlocks = [];
      for(let unlock of this.data.data.allunlocks){
        if(unlock.seuil > this.data.data.products[unlock.idcible].quantite ){
          unlocks.push(unlock)
        }
      }
      return unlocks
    }
  }