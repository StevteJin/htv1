import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
declare var layer: any;

@Component({
  selector: 'app-usercenter',
  templateUrl: './usercenter.component.html',
  styleUrls: ['./usercenter.component.css']
})
export class UsercenterComponent implements OnInit, OnDestroy {
  public menuList = [{
    id: 'withdraw',
    name: '提现',
    class: ''
  }, {
    id: 'recharge',
    name: '充值',
    class: 'sell'
  }, {
    id: 'deposit',
    name: '入金',
    class: 'deposit'
  }, {
    id: 'chujin',
    name: '出金',
    class: 'chedan'
  }, {
    id: 'capitalflow',
    name: '资金流水',
    class: 'chicang'
  }];
  public userInfo: DataService['userInfo'];
  public logo = 'hk';
  freezaFee = 0;
  ableScale = 0;
  allottedScale = '';
  is_agent: any;
  is_agent_bool:Boolean;
  constructor(public data: DataService, public http: HttpService) {
  }
  ngOnDestroy() {
    this.data.clearInterval();
  }
  ngOnInit() {
    this.logo = this.data.logo;
    this.data.clearInterval();
    this.userInfo = this.data.userInfo;
    this.usercenter();
    this.is_agent = localStorage.getItem('is_agent')
    if(this.is_agent==1){
      this.is_agent_bool=true
    }else{
      this.is_agent_bool=false
    }
    console.log('我是类型',this.is_agent)
    console.log('我是布尔值',this.is_agent_bool);
  }

  goto(url) {
    this.data.goto('main/jiaoyi/' + url);
  }

  goto1(url) {
    if (url === 'card') {
      this.data.setSession('updateCard', true);
    }
    this.data.goto(url);
  }

  setting() {
    this.data.goto('setting');
  }

  usercenter() {
    console.log("usercenter>>")
    this.http.userCenter().subscribe((res: DataService['userInfo']) => {
      this.userInfo = res;
      const backscale = res['balance'];
      this.data.setSession('userName', res['accountName']);
      this.data.setSession('ableTakeoutScale', res['ableTakeoutScale']);
      this.freezaFee = parseFloat(this.userInfo.lockScale) + parseFloat(this.userInfo.freezeScale);
      this.data.setSession('backscale', parseFloat(backscale) <= 0 ? 0 : backscale);
      this.data.intervalCapital = setTimeout(() => {
        this.usercenter();
      }, 60000);
      this.allottedScale = res.allottedScale;
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    }, () => {
      this.data.Loading(this.data.hide);
    });
  }
  /**
  * 取消订阅
  */
  cancelSubscribe() {
    this.http.cancelSubscribe().subscribe((res) => {
      this.data.resetStockHQ();
      console.log('取消订阅');
    });
  }

  logout() {
    this.cancelSubscribe();
    this.data.ErrorMsg('注销成功');
    this.data.isConnect = false;
    this.data.token = this.data.randomString(32);
    localStorage.removeItem('h5tncltoken');
    this.data.removeSession('opUserCode');
    setTimeout(() => {
      this.data.goto('main/login');
    }, 1000);
  }

  goto2(url) {
    if (url === 'withdraw') {
      this.http.getCard().subscribe(res => {
        if (this.data.isNull(res)) {
          this.data.ErrorMsg('请先绑定银行卡');
          this.data.goto('card');
        } else {
          this.data.goto(url);
        }
      });
    } else {
      this.data.goto(url);
      this.data.setSession('cashScale', this.userInfo['cashScale']);
      this.data.setSession('allottedScale', this.userInfo.allottedScale);
    }

  }

  // 结案
  submit() {
    if (this.allottedScale !== '0') {
      layer.open({
        content: '确定结案？'
        , btn: ['确定', '取消']
        , yes: (index) => {
          layer.close(index);
          this.http.finishStrategy().subscribe(res => {
            this.data.ErrorMsg('结案成功');
            setTimeout(() => {
              this.data.back();
            }, 1000);
          }, (err) => {
            this.data.error = err.error;
            this.data.isError();
          });
        }
      });
    } else {
      this.data.ErrorMsg('此账户还没有申请策略，没有可结束的方案');
    }
  }

  userDetail() {
    this.data.goto('userDetail');
  }
}
