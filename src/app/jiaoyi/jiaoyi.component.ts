import { Component, DoCheck } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
@Component({
  selector: 'app-jiaoyi',
  templateUrl: './jiaoyi.component.html',
  styleUrls: ['./jiaoyi.component.css']
})
export class JiaoyiComponent implements DoCheck {
  public url: string;
  routerState = true;
  routerStateCode = 'active';
  public menuList: any;
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
  userInfo: any;
  width1: any;
  width2: any;
  constructor(public data: DataService, public http: HttpService) {
    this.menuList = this.data.getCenterMenuList();
  }

  ngDoCheck() {
    if (this.data.nowUrl !== this.data.getUrl(3)) {
      this.data.nowUrl = this.data.getUrl(3);
      this.url = this.data.getUrl(3);
      this.data.clearInterval();
    }

  }
  ngOnInit() {
    this.http.userDetail().subscribe(res => {
      Object.assign(this.detail, res);
      console.log('我是个人详情', this.detail)
      //平仓线
      this.data1 = this.detail.flatLine;
      //预警线
      this.data2 = this.detail.cordonLine;
      this.userInfo = this.data.userInfo;
      this.usercenter();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
    console.log('destroy');
    this.data.clearInterval();
  }

  usercenter() {
    console.log("usercenter>>")
    this.http.userCenter().subscribe((res: DataService['userInfo']) => {
      this.userInfo = res;
      //总资产
      this.data3 = this.userInfo.totalScale;
      console.log('我是总资产', this.data3);
      console.log('我', this.userInfo)
      if ((this.data2 / this.data3) * 100 < 50) {
        this.width1 = (this.data1 / this.data3) * 100 + '%';
        this.width2 = (this.data2 / this.data3) * 100 + 5 + '%';
      } else if ((this.data2 / this.data3) * 100 > 80) {
        this.width1 = (this.data1 / this.data3) * 100 - 20 + '%';
        this.width2 = (this.data2 / this.data3) * 100 - 15 + '%';
      }else{
        this.width1 = (this.data1 / this.data3) * 100  + '%';
        this.width2 = (this.data2 / this.data3) * 100 + '%';
      }
      console.log('数据1', this.data1);
      console.log('数据2', this.data2);
      console.log('数据3', this.data3);
      console.log('宽度1', this.width1)
      console.log('宽度2', this.width2)
      if (document.getElementById('data1')) {
        document.getElementById('data1').style.width = this.width1;
      }
      if (document.getElementById('data2')) {
        document.getElementById('data2').style.width = this.width2;
      }
      this.data.intervalCapital = setTimeout(() => {
        this.usercenter();
      }, 60000);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.Loading(this.data.hide);
    });
  }

  goto(url) {
    if (url !== this.data.getUrl(3)) {
      this.http.cancelSubscribe().subscribe(res => {
        console.log('取消订阅');
      });
      this.data.sellCnt = '';
      this.data.searchStockCode = '';
      this.data.resetStockHQ();
      this.data.removeSession('optionCode');
      this.url = url;
      this.data.goto('main/jiaoyi/' + url);
    }


  }

}
