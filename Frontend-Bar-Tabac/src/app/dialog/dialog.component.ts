import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Palier, World  } from '../world';

import { CommonModule } from '@angular/common';


export interface DialogData {
    data: World;
    server: string;
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
export class DialogComponent implements OnInit, OnDestroy {
    listunlocks: Palier[] = [];
    listClosestUnlock: Palier[] = [];
    listClosestUpgrade: Palier[] = [];  
    

   
    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.getUnlocks();
        this.getClosestUnlockForProducts();
        this.getSortedUpgrades();
    }
    
    ngOnDestroy(): void {
        this.listunlocks = [];
        this.listClosestUnlock = [];
        this.listClosestUpgrade = [];
    }

    getUnlocks() {   
        this.data.data.products.forEach((product) => {
            product.paliers.forEach((palier) => {
                if (palier.seuil >= product.quantite) {
                    this.listunlocks.push(palier);
                }
            });
        })

        this.data.data.allunlocks.forEach((unlock) => {
            this.listunlocks.push(unlock);
        });
    }

    getClosestUnlockForProducts() {
        const closestUnlocks: { [productId: string]: Palier | null } = {};

        this.data.data.products.forEach((product) => {
            let closestUnlock: Palier | null = null;
            let closestDistance = Infinity; // Initialisation à une valeur très grande
    
            product.paliers.forEach((palier) => {
                const distance = Math.abs(product.quantite - palier.seuil);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestUnlock = palier;
                }
            });

            if(closestUnlock !== null){
                this.listClosestUnlock.push(closestUnlock); // Stocke le palier le plus proche pour ce produit
            }
        });

        let seuilmin = Infinity ; 
        let closestAllUnlocks: Palier | null = null;
        this.data.data.allunlocks.forEach((unlock) => {
            if(!unlock.unlocked){
                console.log("unlock", unlock.name, "seuil", unlock.seuil, "min", seuilmin)
                if(unlock.seuil < seuilmin){
                    seuilmin = unlock.seuil;
                    closestAllUnlocks = unlock;
                    console.log("closestAllUnlocks", closestAllUnlocks)
                }
            }
        }); 
        if(closestAllUnlocks !== null){
            this.listClosestUnlock.push(closestAllUnlocks);
    
        }
    }
   
    getSortedUpgrades(){
        this.data.data.upgrades.forEach((upgrade) => {
            if(!upgrade.unlocked){
                this.listClosestUpgrade.push(upgrade);                
            }
        });
        this.listClosestUpgrade.sort((a, b) => a.seuil - b.seuil);
        console.log(this.listClosestUpgrade);
    }

    buyManager(palier: Palier) {
        this.onBuyManager.emit(palier);
    }

    buyUpgrade(palier: Palier) {
        this.onBuyUpgrade.emit(palier);
    }

    buyAngelUpgrade(palier: Palier) {
        this.onBuyAngelUpgrade.emit(palier);
    }


    resetWorld() {
        this.onResetWorld.emit();
    }
    

    @Output() onBuyManager: EventEmitter<Palier> = new EventEmitter<Palier>();

    @Output() onBuyUpgrade: EventEmitter<Palier> = new EventEmitter<Palier>();

    @Output() onBuyAngelUpgrade: EventEmitter<Palier> = new EventEmitter<Palier>();

    @Output() onResetWorld: EventEmitter<void> = new EventEmitter<void>();

}