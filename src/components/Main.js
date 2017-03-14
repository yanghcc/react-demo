require('normalize.css/normalize.css');
require('styles/App.styl');
require('../base/base.js');

import React from 'react';
import Axios from 'axios';
import X2JS from '../base/xml2json.min.js'
import moment from 'moment'
import ReactPullLoad from 'react-pullload'

class AppComponent extends React.Component{
  constructor(){
    super();
    this.refreshResolve = null //用于保存刷新或者加载更多的resolve函数
    this.loadMore = this.loadMore.bind(this);
    this.refresh = this.refresh.bind(this);
    // this.loadFn = this.loadFn.bind(this);
    this.state ={
      hasMore: true,
      data: [],
      allData: [],
      dataLen: 0,
      step: 10,
      times: 0
    }
  }
  loadFn(){
     Axios.get('/feed')
        .then((response) => {
          var x2js = new X2JS();
          var dataObj = response.data;
          var jsonObj = x2js.xml_str2json( dataObj );
          var itemData = jsonObj.rss.channel.item;
          var res = [];
          for (var i = itemData.length; i >= 0; i--) {
            res.push(itemData[i])
          }
          res.shift();//删除数组第一个数据
          this.setState({
            allData: res,
            data: res.slice(0, this.state.step),
            hasMore: true
          });
          this.state.dataLen = res.length;
        })
        .catch(function (error) {
          console.log(error);
        });
  }
  /*
   * 下拉刷新功能
   * @param resolve,reject 回调函数
   */
  refresh(resolve) {
    setTimeout(()=>{
      this.loadFn();
      resolve();
    },1500)
  }
  //加载更多
  loadMore(resolve){
    const{dataLen, step, allData} = this.state
    this.state.times +=1;
    if ((this.state.times) * step >= dataLen) {
        this.setState({
          hasMore: false
        })
        console.log("nodata")
      }
    setTimeout(()=>{
      this.setState({
      	data: allData.slice(0, this.state.times * step)
      });
      resolve();
    },1500)
  }
  // resolve(){
  //   this.setState({
  //       data: []
  //     });
  // }
  componentDidMount(){
     this.loadFn();
  }
  newmoment(arg) {
     return moment(arg).format('MM月DD日 hh:mm')
  }
  handlerData(str) {
        var dd = '';
        str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/i, function (match, capture) {
             dd = capture
        });
        this.props.imgsUrl.url = dd
        // console.log(this.props.imgsUrl.url = dd)
        var str = str.substring(0,300);
        return str.replace(/<[^>]+>/g,"");
  }
  render(){
    const {data, hasMore} = this.state
    return (
      <div>
        <ReactPullLoad
          downEnough={100}
          onRefresh={this.refresh.bind(this)}
          onLoadMore={this.loadMore.bind(this)}
          hasMore={hasMore}>
            <ul className="test-ul">
              {
                data.map( ( item,index )=>{
                  return <li key={index}>
                            <h1 className="itme-title">{item.title.__cdata}</h1>
                            <div className="itembox clearfix">
                              <span className="author">{item.author}</span>
                              <span className="category">{item.category}</span>
                              <span className="timebox">{this.newmoment(item.pubDate.__cdata)}</span>
                            </div>
                            <a className="item-content" href={item.link}>
                              <div className="leftbox">{this.handlerData(item.description.__cdata)}</div>
                              <div className="rightbox">
                                <div className="imgbox"><img className="img" src={this.props.imgsUrl.url ? this.props.imgsUrl.url:'/images/404.jpg'}></img></div>
                              </div>
                            </a>
                        </li>
                })
              }
            </ul>
        </ReactPullLoad>
      </div>
    )
  }
}

AppComponent.defaultProps = {
  imgsUrl: {
    url: ""
  }
};

export default AppComponent;
