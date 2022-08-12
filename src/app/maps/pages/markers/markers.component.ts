import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color?: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.css']
})
export class MarkersComponent implements AfterViewInit {

  @ViewChild('map') divMap!: ElementRef;

  map!: mapboxgl.Map;

  zoomLevel: number = 15;

  center: [number, number] = [-6, 37.4];

  markers: MarkerColor[] = []

  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
    });

    this.readLocalStorage();
  }

  goToMarker(marker: mapboxgl.Marker) {
    this.map.flyTo({
      center: marker.getLngLat()
    });
  }

  aggregateMarker() {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const marker = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat(this.map.getCenter())
      .addTo(this.map);

    this.markers.push({
      color,
      marker
    });

    this.saveMarkerLocalStorage();

    marker.on('dragend', () => {
      this.saveMarkerLocalStorage();
    })
  }

  saveMarkerLocalStorage() {
    const lngLatArr: MarkerColor[] = [];

    this.markers.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      lngLatArr.push({
        color,
        center: [lng, lat]
      });
    })

    localStorage.setItem('markers', JSON.stringify(lngLatArr));
  }

  readLocalStorage() {

    const storage = localStorage.getItem('markers');

    if (!storage) {return;}

    const lngLatArr: MarkerColor[] = JSON.parse(storage);

    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable:true
      })
        .setLngLat(m.center!)
        .addTo(this.map)
      this.markers.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', () => {
        this.saveMarkerLocalStorage();
      })
    })
  }

  deleteMarker(i: number) {
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);
    this.saveMarkerLocalStorage();
  }

}
