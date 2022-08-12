import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { map } from 'rxjs';

@Component({
  selector: 'app-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {

  @ViewChild('map') divMap!: ElementRef;

  @Input() lngLat: [number, number] = [0, 0]

  constructor() { }

  ngAfterViewInit(): void {
    const map = new mapboxgl.Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false
    });

    new mapboxgl.Marker().setLngLat(this.lngLat).addTo(map);
  }

}
