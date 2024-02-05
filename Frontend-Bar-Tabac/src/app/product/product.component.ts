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
  money: number = 0
  progressbarvalue: number = 0
  server = GET_SERV;
  idInterval: any;

  // Passage du produit depuis le composant parent
  @Input()
  set prod(value: Product) {
    if (value != undefined) {
      this.product = value;
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
    }
  }

  constructor() { }

  ngOnInit(): void {
    setInterval(() => {
      // this.calcScore();
    }, 1000);
  }

  onClick() {
    console.log("click")
    this.product.timeleft = this.product.vitesse;
    this.lastupdate = Date.now();
  }

  calcScore() {
    if (this.product.timeleft === 0) {
      return;
    } else {
      const timeElapsed = Date.now() - this.lastupdate;

      if (this.product.timeleft < 0) {
        this.product.timeleft = 0;

        this.progressbarvalue = 0;


      } else {
        this.product.timeleft = this.product.timeleft - timeElapsed;

        this.progressbarvalue = Math.round(((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100);
      }
    }
  }

  // @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
}
