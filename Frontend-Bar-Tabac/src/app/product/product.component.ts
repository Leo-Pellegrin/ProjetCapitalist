import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../world';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {GET_SERV} from '../../request';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

export class ProductComponent {
  product: Product = new Product();
  lastupdate: number = Date.now();

  @Input() 
  set prod(value: Product) {
      if(value != undefined){
        this.product = value; 
      }
  }
  money : number = 0
  progressbarvalue : number = 0
  server = GET_SERV;

  onClick(){
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
  }

  calcScore(){
    if(this.product.timeleft != 0){

      let timepast = Date.now() - this.lastupdate;
      this.product.timeleft -= timepast;

      if(this.product.timeleft < 0){
        this.product.timeleft = 0;
      }
      else if(this.product.timeleft == 0){
        this.progressbarvalue = 0
      }
      else{
        this.progressbarvalue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100;
      }
    }
  }

//  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  ngOnInit(): void {
    setInterval(() => { this.calcScore(); }, 100);
  }
}
