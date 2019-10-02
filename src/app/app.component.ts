import {AfterViewInit, Component, NgZone} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {MapboxLayer} from '@deck.gl/mapbox';
import {HttpClient} from '@angular/common/http';
import {Deck} from '@deck.gl/core';
import {IconLayer} from '@deck.gl/layers';

mapboxgl.accessToken = 'pk.eyJ1IjoibmFnbyIsImEiOiJjaXk3ZGp5NnowMDBsMzNxcnpqaGY1OTg0In0.8ZWBZVDYoH7Oj4vdoYOMoA';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'test-deck-angular8';
  map: mapboxgl.Map;
  private deck: Deck;

  constructor(private http: HttpClient,
              private zone: NgZone) {
  }


  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const url = 'mapbox://styles/nago/cjf7yxrg24khd2rqp4e0yj8o2';
      this.map = new mapboxgl.Map({
        container: 'map__element',
        center: [10.3799, 32.7539],
        style: url,
        zoom: 2.0
      });

      this.deck = new Deck({
        gl: this.map.painter.context.gl,
        layers: [],
        pickingRadius: 2,
        onClick: (e) => {
          console.log('Clicked on Deck gl !', e);
        }
      });

      this.map.on('load', () => {
        this.map.addLayer(new MapboxLayer({
          id: 'something', onClick: () => {
            console.log('clickeeeed !!!!!');
          }, deck: this.deck
        }));
      });
    });
  }

  getRandomInRange(from, to, fixed) {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
    // .toFixed() returns string, so ' * 1' is a trick to convert to number
  }

  addData() {
    const data = [];
    for (let i = 0; i < 2000; i++) {
      const item: any = {};
      item.position = [this.getRandomInRange(-100, 100, 6), this.getRandomInRange(1, 100, 6)];
      item.data = {
        name: 'some name',
        age: 234,
        smth: 'smth'
      };
      item.icon = {
          url: 'assets/app/icons/map-icons/LOCATION-7ed321.svg',
          width: 128,
          height: 128
      };
      data.push(item);
    }
    this.zone.runOutsideAngular(() => {
      const newDataSetLayer = new IconLayer({
        id: 'some_id',
        pickable: true,
        getIcon: d => d.icon,
        sizeScale: 20,
        data,
        getPosition: d => d.position,
        onClick: e => {
          console.log('clicked on this: ', e);
          return true;
        },
        onHover: d => console.log(d),
        getColor: d => {
          return d.transparent ? [0, 0, 0, 100] : [0, 0, 0];
        }
      });

      this.deck.setProps({
        layers: [newDataSetLayer]
      });
    });
  }
}
