import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { World, Palier, Product } from './world';
import { WebserviceService } from './webservice.service';
import { ProductComponent } from './product/product.component';
import { GET_SERV } from '../request';
import { BigvaluePipe } from './bigvalue.pipe';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
// Material message éphémère
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';

// FormsModule
import { FormsModule } from '@angular/forms';

// Dialog
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductComponent, BigvaluePipe, CommonModule, MatSnackBarModule, MatBadgeModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  title = 'bar-tabac';
  world: World = new World();
  server = GET_SERV;
  switchPositions = ['x1', 'x10', 'x100', 'Max'];
  currentPositionIndex = 0;
  qtmulti = this.switchPositions[this.currentPositionIndex];
  showManagers = false;
  showUpgrades = false; 
  badgeManagers: number = 0;
  badgeUpgrades: number = 0;
  backgroundImageUrl: string = "http://localhost:4000/icones/ferme_background.png"
  username: string = ""
  isBrowser = signal(false);

  toggleSwitch() {
    this.currentPositionIndex = (this.currentPositionIndex + 1) % this.switchPositions.length;
    this.qtmulti = this.switchPositions[this.currentPositionIndex];
  }

  constructor(private service: WebserviceService, private snackBar: MatSnackBar, @Inject(PLATFORM_ID) private platformId: object, public dialog: MatDialog) {
    this.isBrowser.set(isPlatformBrowser(platformId));

    if (this.isBrowser()) {
      this.username = localStorage.getItem("username") || "Anonymous" + Math.floor(Math.random() * 100000).toString();
      this.service.setUser(this.username);
    }

    this.service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
        console.log(this.world.managers)
      }
    );
  }

  openDialogManager(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {data : this.world, server: this.server, type: "manager"},
    });
  }

  openDialogUpgrade(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {data : this.world, server: this.server, type: "upgrade"},
    });
  }

  onProductionDone(product: Product) {
    if (product.revenu > 0) {
      let upgrades = this.world.upgrades.filter(upgrads => (upgrads.idcible == product.id) && upgrads.unlocked == true);
      for (let upgrad of upgrades) {
        if(upgrad.typeratio == "gain"){
          product.revenu *= upgrad.ratio;          
        }
      }
      this.world.money += product.revenu;
      this.calcbadgeManagers();
      this.calcbadgeUpgrades();
      console.log(`Production of product ${product.revenu} completed. Total money: ${this.world.money}`);
    } else {
      console.warn(`Production of product with non-positive revenu (${product.revenu}) skipped.`);
    }
  }

  onBuy(eventData: [productCost: number, product: Product, maxCanBuy: number]) {
    this.world.money -= eventData[0];
    switch (this.currentPositionIndex) {
      case 0:
        this.world.products[eventData[1].id].quantite += 1;
        this.world.products[eventData[1].id].cout = Math.round((eventData[1].cout * eventData[1].croissance) * 100) / 100;
        break;
      case 1:
        this.world.products[eventData[1].id].quantite += 10;
        this.world.products[eventData[1].id].cout = Math.round(eventData[1].cout * (Math.pow(eventData[1].croissance, 10 - 1)) * 100) / 100;
        break;
      case 2:
        this.world.products[eventData[1].id].quantite += 100;
        this.world.products[eventData[1].id].cout = Math.round(eventData[1].cout * (Math.pow(eventData[1].croissance, 100 - 1)) * 100) / 100;
        break;
      case 3:
        this.world.products[eventData[1].id].quantite += eventData[2];
        this.world.products[eventData[1].id].cout = Math.round(eventData[1].cout * (Math.pow(eventData[1].croissance, eventData[2] - 1)) * 100) / 100;
        break;
    }
    this.calcbadgeManagers();
    this.calcbadgeUpgrades();
  }

  hireManager(manager: Palier) {
    if (this.world.money >= manager.seuil) {
      this.world.managers[manager.idcible].unlocked = true;
      this.world.products[manager.idcible].managerUnlocked = true;
      this.world.money -= manager.seuil;
      this.calcbadgeManagers();
      this.calcbadgeUpgrades();
      this.popMessage("Manager " + manager.name + " hired");
    }
    else {
      this.popMessage("Not enough money to hire this manager");
    }
  }

  buyUpgrade(upgrade: Palier) {
    if (this.world.money >= upgrade.seuil) {
      let up = this.world.upgrades.find(up => up.name == upgrade.name)
      if(up){
        up.unlocked = true;
      }
      this.world.money -= upgrade.seuil;
      this.calcbadgeUpgrades();
      this.calcbadgeManagers();
      this.popMessage("Manager " + upgrade.name + " hired");
    }
    else {
      this.popMessage("Not enough money to hire this manager");
    }
  }

  getUnlock(unlock: Palier, product:Product){
    let unlocks = [];
    for(unlock of this.world.allunlocks){
      if(unlock.seuil > this.world.products[unlock.idcible].quantite ){
        unlocks.push(unlock)
      }
    }
    
  }


  popMessage(message: string): void {
    this.snackBar.open(message, "", { duration: 2000 })
  }

  calcbadgeManagers() {
    this.badgeManagers = 0;
    for (let manager of this.world.managers) {
      if (manager.unlocked == false && this.world.money >= manager.seuil) {
        this.badgeManagers++;
      }
    }
  }

  calcbadgeUpgrades() {
    this.badgeUpgrades = 0;
    for (let upgrade of this.world.upgrades) {
      if (upgrade.unlocked == false && this.world.money >= upgrade.seuil) {
        this.badgeUpgrades++;
      }
    }
  }

  onUsernameChanged() {
    if (this.username == "") {
      this.username = "Anonymous" + Math.floor(Math.random() * 10000).toString();
    }
    localStorage.setItem('username', this.username);
    this.service.setUser(this.username);
  }
}
