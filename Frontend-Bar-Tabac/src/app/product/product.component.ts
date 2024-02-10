import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../world';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { GET_SERV } from '../../request';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent implements OnInit {
  product: Product = new Product();
  lastupdate: number = Date.now();
  _qtmulti: string = "1";
  _worldmoney: number = 0;
  maxCanBuy: number = 0;
  progressbarvalue: number = 0
  server = GET_SERV;

  constructor() { }

  ngOnInit(): void {
    // setInterval(() => {
    //   // this.calcScore();
    // }, 1000);
  }

  // Passage du produit depuis le composant parent
  @Input()
  set prod(value: Product) {
    if (value != undefined) {
      this.product = value;
    }
  }

  @Input()
  set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  @Input()
  set worldmoney(value: number) {
    this._worldmoney = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
  }

  // Quantité maximale que l'on peut acheter avec l'argent actuel
  calcMaxCanBuy() {
    let n = this.getBaseLog(this.product.croissance, (this._worldmoney / this.product.cout));
    this.maxCanBuy = n;
  }

  getBaseLog(x: number, y:number) {
    return Math.log(y) / Math.log(x);
  }

  // Lancement d'un produit
  onClick() {
    this.product.timeleft = this.product.vitesse;
    this.lastupdate = Date.now();
  }

  // Calcul de la progression de la production
  calcScore() {
    if (this.product.timeleft === 0) {
      return;
    } else {
      const timeElapsed = Date.now() - this.lastupdate;

      if (this.product.timeleft < 0) {
        this.product.timeleft = 0;

        this.progressbarvalue = 0;
        this.notifyProduction.emit(this.product);

      } else {
        this.product.timeleft = this.product.timeleft - timeElapsed;

        this.progressbarvalue = Math.round(((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100);
      }
    }
  }

  // Achat d'un produit
  buyProduct() {
    if (this._worldmoney >= this.product.cout) {
      this._worldmoney -= this.product.cout;
      this.notifyBuy.emit(this.product);
    }
  }

  // Evénement de fin de production
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  // Evénement d'achat
  @Output() notifyBuy: EventEmitter<Product> = new EventEmitter<Product>();
}
