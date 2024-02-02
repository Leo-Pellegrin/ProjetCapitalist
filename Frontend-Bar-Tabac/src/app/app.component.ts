import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {World, Palier, Product} from './world'; 
import { WebserviceService } from './webservice.service';
import { ProductComponent } from './product/product.component';
import {GET_SERV } from '../request';
import { BigvaluePipe } from './bigvalue.pipe';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductComponent, BigvaluePipe],
  templateUrl: './app.component.html',
})

export class AppComponent{
    title = 'bar-tabac';
    world: World = new World();
    server = GET_SERV;

    constructor(private service: WebserviceService) {
      this.service.getWorld().then(
        world => {
          this.world = world.data.getWorld;
        }
      );
    }
}
