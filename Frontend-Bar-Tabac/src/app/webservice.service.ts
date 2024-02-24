import { Injectable } from '@angular/core';
import { Client, fetchExchange } from '@urql/core';
import { GET_WORLD } from './grapqhrequests';

@Injectable({
  providedIn: 'root',
})
export class WebserviceService {

  server = 'http://localhost:4000/';
  user = '';

  constructor() { }

  createClient() {
    return new Client({
      url: this.server + "graphql",
      exchanges: [fetchExchange],
      fetchOptions: () => {
        return {
          headers: { 'x-user': this.user },
        };
      },
    });
  }

  getWorld() {
    return this.createClient().query(GET_WORLD, {}).toPromise();
  }
}
