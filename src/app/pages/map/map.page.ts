import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare var mapboxgl: any

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit, AfterViewInit {

  lat: number;
  lon: number;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    let geo: any = this.activatedRoute.snapshot.paramMap.get('geo');

    geo = geo.substring(4);
    geo = geo.split(',');

    this.lat = Number(geo[0]);
    this.lon = Number(geo[1]);

  }

  ngAfterViewInit() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiYW50aG9ueS1mbG9yZXMiLCJhIjoiY2p3eHltMWloMHpwazQ4bXo1ZDYyNjZsaSJ9.uPcsi-HtpqnKe9joMG-Ntw';
    let coordinates = document.getElementById('coordinates');

    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lon, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map'
      });
      
    // MARCADOR
    const marker = new mapboxgl.Marker({
        draggable: true
      })
      .setLngLat([this.lon, this.lat])
      .addTo(map);
       
      function onDragEnd() {
        var lngLat = marker.getLngLat();
        coordinates.style.display = 'block';
        coordinates.innerHTML = 'Longitude: ' + lngLat.lng + '<br />Latitude: ' + lngLat.lat;
        this.lat =  lngLat.lat;
        this.lon =  lngLat.lng;
        console.log('LAT: ',lngLat.lat);
        console.log('LON: ',lngLat.lng);
        console.log('AFTER');
        console.log('LAT: ',this.lat);
        console.log('LON: ',this.lon);
      }
         
      marker.on('dragend', onDragEnd);


      // EDIFICIOS 

      map.on('load', () => {

        map.resize();
        // Insert the layer beneath any symbol layer.
        const layers = map.getStyle().layers;
         
        let labelLayerId;
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
          }
        }
         
        map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
          'fill-extrusion-color': '#aaa',
          
          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': [
          "interpolate", ["linear"], ["zoom"],
          15, 0,
          15.05, ["get", "height"]
          ],
          'fill-extrusion-base': [
          "interpolate", ["linear"], ["zoom"],
          15, 0,
          15.05, ["get", "min_height"]
          ],
          'fill-extrusion-opacity': .6
          }
        }, labelLayerId);
        });

        // Localizar
        map.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
          enableHighAccuracy: true
          },
          trackUserLocation: true
        }));

  }


}
