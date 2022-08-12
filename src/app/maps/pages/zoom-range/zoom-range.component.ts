import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.css']
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap!: ElementRef;

  map!: mapboxgl.Map;

  zoomLevel: number = 10;

  center: [number, number] = [-6, 37.4];

  constructor() { }

  ngOnDestroy(): void {
    this.map.off('move', () => {});
    this.map.off('zoom', () => {});
    this.map.off('zoomEnd', () => {});
  }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
    });

    this.map.on('zoom', (ev) => {
      this.zoomLevel = this.map.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      this.zoomLevel = this.map.getZoom();
      if(this.map.getZoom() > 18) {
        this.map.zoomTo(18);
      }
    });

    this.map.on('move', (ev) => {
      const target = ev.target;
      const  {lng, lat} = target.getCenter();
      this.center = [lng, lat];
    });
  }

  zoomOut() {
    this.map.zoomOut();
    this.zoomLevel = this.map.getZoom();
  }

  zoomIn() {
    this.map.zoomIn();
    this.zoomLevel = this.map.getZoom();
  }

  zoomChange(value: string) {
    this.map.zoomTo(Number(value));
  }

}
