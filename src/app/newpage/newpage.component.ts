import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { ActivatedRoute } from '@angular/router';
declare var layer: any;
@Component({
  selector: 'app-newpage',
  templateUrl: './newpage.component.html',
  styleUrls: ['./newpage.component.css']
})
export class NewpageComponet implements OnInit, OnDestroy {
  text = "1111";
  constructor(public data: DataService, public http: HttpService, public activeRoute: ActivatedRoute) {

  }
  ngOnDestroy() {

  }
  ngOnInit() {

  }

  back() {
    this.data.back();
  }
}
