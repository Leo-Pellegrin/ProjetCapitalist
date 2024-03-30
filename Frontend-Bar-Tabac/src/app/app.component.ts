import { Component, signal, Inject, PLATFORM_ID, ViewChildren, QueryList } from '@angular/core';
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
import { Dialog } from '@angular/cdk/dialog';

import { Router } from '@angular/router';

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
  badgeAngelUpgrades: number = 0;
  backgroundImageUrl: string = "http://localhost:4000/icones/ferme_background.png"
  isBrowser = signal(false);
  username: string = "";

  toggleSwitch() {
    this.currentPositionIndex = (this.currentPositionIndex + 1) % this.switchPositions.length;
    this.qtmulti = this.switchPositions[this.currentPositionIndex];
  }

  constructor(private service: WebserviceService, private snackBar: MatSnackBar, @Inject(PLATFORM_ID) private platformId: object, public dialog: MatDialog, private router: Router) {
    this.isBrowser.set(isPlatformBrowser(platformId));

    if (this.isBrowser()) {
      
      this.username = localStorage.getItem("username") || "Anonymous" + Math.floor(Math.random() * 100000).toString();
      this.service.setUser(this.username);
      console.log(this.username);
    }

    this.service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
      }
    );
  }

  openDialogManager(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { data: this.world, server: this.server, type: "manager" },
      height: '600px',
      width: '800px',
    });
    dialogRef.componentInstance.onBuyManager.subscribe((data) => {
      this.hireManager(data);
    });
  }

  openDialogUpgrade(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { data: this.world, server: this.server, type: "upgrade" },
      height: '600px',
      width: '800px',
    });
    dialogRef.componentInstance.onBuyUpgrade.subscribe((data) => {
      this.buyUpgrade(data);
    });
  }

  openDialogAngelUpgrade(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { data: this.world, server: this.server, type: "angelupgrade" },
      height: '600px',
      width: '800px',
    });
    dialogRef.componentInstance.onBuyAngelUpgrade.subscribe((data) => {
      this.buyAngelUpgrade(data);
    });
  }

  openDialogUnlock(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { data: this.world, server: this.server, type: "unlock" },
      height: '600px',
      width: '800px',
    });
  }

  openDialogInvestors(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { data: this.world, server: this.server, type: "investors" },
      height: '600px',
      width: '800px',
    });
    //claimAngels à definir 
    dialogRef.componentInstance.onResetWorld.subscribe((data) => {
      this.resetWorld();
    });

  }

  onProductionDone(product: Product) {
    if (product.revenu > 0) {
      if (this.world.activeangels > 0) {
        this.world.money += product.revenu * product.quantite * (1 + this.world.activeangels * this.world.angelbonus / 100);
      }
      else {
        this.world.money += product.revenu * product.quantite;
      }
      this.calcbadgeManagers();
      this.calcbadgeUpgrades();
      this.calcbadgeAngelUpgrades();
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
        this.service.BuyqtProduct(eventData[1].id, 1).catch(reason => {
          console.log("erreur: " + reason)
        });
        break;
      case 1:
        this.world.products[eventData[1].id].quantite += 10;
        this.world.products[eventData[1].id].cout = Math.round(eventData[1].cout * (Math.pow(eventData[1].croissance, 10 - 1)) * 100) / 100;
        this.service.BuyqtProduct(eventData[1].id, 10).catch(reason => {
          console.log("erreur: " + reason)
        });
        break;
      case 2:
        this.world.products[eventData[1].id].quantite += 100;
        this.world.products[eventData[1].id].cout = Math.round(eventData[1].cout * (Math.pow(eventData[1].croissance, 100 - 1)) * 100) / 100;
        this.service.BuyqtProduct(eventData[1].id, 100).catch(reason => {
          console.log("erreur: " + reason)
        });
        break;
      case 3:
        this.world.products[eventData[1].id].quantite += eventData[2];
        this.world.products[eventData[1].id].cout = Math.round(eventData[1].cout * (Math.pow(eventData[1].croissance, eventData[2] - 1)) * 100) / 100;
        this.service.BuyqtProduct(eventData[1].id, eventData[2]).catch(reason => {
          console.log("erreur: " + reason)
        });
        break;
    }
    let unlocks: Palier[] = [];

    this.world.products[eventData[1].id].paliers.forEach((unlock) => {
      if (unlock.idcible == eventData[1].id) unlocks.push(unlock)
    })

    for (let unlock of unlocks) {
      if (unlock.seuil <= this.world.products[eventData[1].id].quantite && !unlock.unlocked) {
        this.world.products[eventData[1].id].paliers.filter(ul => unlock.name === ul.name).forEach(p => p.unlocked = true);
        this.productsComponent?.find((product) => { return product.product.id == unlock.idcible; })?.calcUpgrade(unlock)
        this.popMessage("Vous avez débloqué l'unlock " + unlock.name);
      }
    }

    for (let unlock of this.world.allunlocks) {
      let productslist = this.world.products.filter(product => product.quantite >= unlock.seuil)
      if (productslist.length >= this.world.products.length && !unlock.unlocked) {
        if (unlock.idcible == -1) {
          this.productsComponent?.forEach(p => p.calcUpgrade(unlock));
        }
        else {
          this.productsComponent?.find((product) => { return product.product.id == unlock.idcible; })?.calcUpgrade(unlock)
        }

        this.world.allunlocks.filter(ul => unlock.name === ul.name).forEach(p => p.unlocked = true);
        this.popMessage("Vous avez débloqué l'unlock " + unlock.name);
      }
    }
    this.calcbadgeManagers();
    this.calcbadgeUpgrades();
    this.calcbadgeAngelUpgrades();
  }

  hireManager(manager: Palier) {
    if (this.world.money >= manager.seuil) {
      this.world.managers[manager.idcible].unlocked = true;
      this.world.products[manager.idcible].managerUnlocked = true;
      this.world.money -= manager.seuil;
      this.calcbadgeManagers();
      this.calcbadgeUpgrades();
      this.calcbadgeAngelUpgrades();
      this.popMessage("Manager " + manager.name + " hired");
      this.service.buyManager(manager).catch(reason => {
        console.log("erreur: " + reason)
      });
    }
    else {
      this.popMessage("Not enough money to hire this manager");
    }
  }

  buyUpgrade(upgrade: Palier) {
    if (this.world.money >= upgrade.seuil) {
      let up = this.world.upgrades.find(up => up.name == upgrade.name)
      if (up) {
        up.unlocked = true;
      }
      this.world.money -= upgrade.seuil;
      this.calcbadgeUpgrades();
      this.calcbadgeManagers();
      this.calcbadgeAngelUpgrades();
      this.popMessage("Upgrade " + upgrade.name + " bought");

      this.productsComponent?.find((product) => { return product.product.id == upgrade.idcible; })?.calcUpgrade(upgrade)
      this.service.buyUpgrade(upgrade).catch(reason =>
        console.log("erreur: " + reason)
      );
    }
    else {
      this.popMessage("Not enough money to buy this upgrade");
    }
  }

  buyAngelUpgrade(angelupgrade: Palier) {
    if (this.world.activeangels >= angelupgrade.seuil) {
      let up = this.world.angelupgrades.find(up => up.name == angelupgrade.name)
      if (up) {
        up.unlocked = true;
      }
      this.world.activeangels -= angelupgrade.seuil;
      this.calcbadgeUpgrades();
      this.calcbadgeManagers();
      this.calcbadgeAngelUpgrades();
      this.popMessage("Angel Upgrade " + angelupgrade.name + " bought");
      if (angelupgrade.typeratio == "gain") {
        this.productsComponent?.forEach((p) => p.calcUpgrade(angelupgrade));
      }
      else if (angelupgrade.typeratio == "ange") {
        this.world.angelbonus = this.world.angelbonus + angelupgrade.ratio;
      }
    }
    else {
      this.popMessage("Not enough money to buy this angel upgrade");
    }
  }

  resetWorld() {
    console.log("reset")
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
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

  calcbadgeAngelUpgrades() {
    this.badgeAngelUpgrades = 0;
    for (let AngelUpgrade of this.world.angelupgrades) {
      if (AngelUpgrade.unlocked == false && this.world.activeangels >= AngelUpgrade.seuil) {
        this.badgeAngelUpgrades++;
      }
    }
  }

  onUsernameChanged() {

    if (this.username == "") {
      this.username = "Anonymous" + Math.floor(Math.random() * 10000).toString();
    }
    localStorage.setItem('username', this.username);
    this.service.setUser(this.username);
    this.service.getWorld().then(
      world => {
        console.log(world);
        this.world = world.data.getWorld;
        window.location.reload();
      }
    );
  }

  @ViewChildren(ProductComponent) productsComponent: QueryList<ProductComponent> | undefined;
}

