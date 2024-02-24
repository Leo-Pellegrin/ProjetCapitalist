import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { World, Palier, Product } from './world';
import { WebserviceService } from './webservice.service';
import { ProductComponent } from './product/product.component';
import { GET_SERV } from '../request';
import { BigvaluePipe } from './bigvalue.pipe';
import { CommonModule } from '@angular/common';

// Material message éphémère
import {MatSnackBarModule, MatSnackBar} from '@angular/material/snack-bar';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductComponent, BigvaluePipe, CommonModule, MatSnackBarModule],
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


  toggleSwitch() {
    this.currentPositionIndex = (this.currentPositionIndex + 1) % this.switchPositions.length;
    this.qtmulti = this.switchPositions[this.currentPositionIndex];
  }

  constructor(private service: WebserviceService, private snackBar: MatSnackBar) {
    this.service.getWorld().then(
      world => {
        this.world = world.data.getWorld;
      }
    );
  }

  onProductionDone(product: Product) {
    if (product.revenu > 0) {
      this.world.money += product.revenu;
      console.log(`Production of product ${product.revenu} completed. Total money: ${this.world.money}`);
    } else {
      console.warn(`Production of product with non-positive revenu (${product.revenu}) skipped.`);
    }
  }

  onBuy(num: number){
    this.world.money -= num;
  }

  hireManager(manager: Palier) {
    this.world.managers[manager.idcible - 1].unlocked = true;
    this.world.products[manager.idcible - 1].managerUnlocked = true;
    if(this.world.money >= manager.seuil){
      this.world.money -= manager.seuil;
      this.popMessage("Manager " + manager.name + " hired");
    }
    else{
      this.popMessage("Not enough money to hire this manager");
    }    
  }

  popMessage(message : string) : void {
    this.snackBar.open(message, "", { duration : 2000 })
  }
}
