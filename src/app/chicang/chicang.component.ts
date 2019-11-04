import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
import { Router, RouterState, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-chicang',
  templateUrl: './chicang.component.html',
  styleUrls: ['../chedan/chedan.component.css']
})
export class ChicangComponent implements OnInit {
  public userInfo: DataService['userInfo'];
  isJiaoyi: any;
  isChicang: any;
  freezaFee: any;
  url: any;
  detail = {
    cashScale: 0,
    commission: 0,
    cordonLine: 0,
    financePeriod: 'day',
    financeRatio: 0,
    financeStartDate: '',
    flatLine: 0,
    manageFeeRate: 0,
    manageMakeFeeRate: 0,
    opUserCode: '',
    positionRatio: 0,
    secondBoardPositionRatio: 0
  };
  data1: any;
  data2: any;
  data3: any;
  width1: any;
  width2: any;
  constructor(public data: DataService, public http: HttpService, private routeInfo: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.data.getUrl(2) === 'chicang') {
      this.isJiaoyi = false;
    } else {
      this.isJiaoyi = true;
    }
    console.log('我啊', '/' + this.data.getUrl(1) + '/' + this.data.getUrl(2) + '/' + this.data.getUrl(3) === '/main/jiaoyi/chicang');
    if (
      '/' + this.data.getUrl(1) + '/' + this.data.getUrl(2) + '/' + this.data.getUrl(3) === '/main/jiaoyi/chicang'
    ) {
      this.isChicang = true;
    } else {
      this.isChicang = false
    }
    this.http.userDetail().subscribe(res => {
      Object.assign(this.detail, res);
      console.log('我是个人详情', this.detail)
      //平仓线
      this.data1 = this.detail.flatLine;
      //预警线
      this.data2 = this.detail.cordonLine;
      this.usercenter();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
    this.userInfo = this.data.userInfo;

    this.url = window.location.href.split('#')[1];
    console.log(this.url)
  }

  overflow(type) {
    if (!type) {
      return 'chicang';
    } else {
      return '';
    }
  }

  usercenter() {
    this.http.userCenter().subscribe((res: DataService['userInfo']) => {
      this.userInfo = res;
      this.data3 = this.userInfo.totalScale;
      console.log('我是总资产', this.data3);
      console.log('我', this.userInfo)
      if ((this.data2 / this.data3) * 100 < 50) {
        this.width1 = (this.data1 / this.data3) * 100 + '%';
        this.width2 = (this.data2 / this.data3) * 100 + 5 + '%';
      } else if ((this.data2 / this.data3) * 100 > 80) {
        this.width1 = (this.data1 / this.data3) * 100 - 20 + '%';
        this.width2 = (this.data2 / this.data3) * 100 - 15 + '%';
      } else {
        this.width1 = (this.data1 / this.data3) * 100 + '%';
        this.width2 = (this.data2 / this.data3) * 100 + '%';
      }
      console.log('宽度1', this.width1)
      console.log('宽度2', this.width2)
      if (document.getElementById('data1')) {
        document.getElementById('data1').style.width = this.width1;
      }
      if (document.getElementById('data2')) {
        document.getElementById('data2').style.width = this.width2;
      }
      this.freezaFee = parseFloat(this.userInfo.lockScale) + parseFloat(this.userInfo.freezeScale);
      this.data.intervalCapital = setTimeout(() => {
        this.usercenter();
      }, 3000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.Loading(this.data.hide);
    });
  }
}
