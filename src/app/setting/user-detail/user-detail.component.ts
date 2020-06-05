import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { HttpService } from '../../http.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  detail = {
    cashScale: 0,
    commission: 0,
    cordonLine: 0,
    financePeriod: 'day',
    financeRatio: 0,
    financeStartDate: '',
    flatLine: 0,
    manageFeeRate: 0,
    manageMakeFeeRate:0,
    opUserCode: '',
    positionRatio: 0,
    secondBoardPositionRatio: 0
  };
  type = {
    day: '按使用金额收取固定收益',
    month: '按申请金额收取固定收益',
    week: '周配',
    //美林顾客
    //single: '免息盈利分成',
    //赢顾客
    single: '按个股盈利分成'
  };
  logo = '';
  constructor(public data: DataService, public http: HttpService) {
    this.logo = this.data.logo;
  }

  ngOnInit() {
    this.http.userDetail().subscribe(res => {
      Object.assign(this.detail, res);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  back() {
    this.data.back();
  }

}
