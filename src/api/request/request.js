
import { CoreRequest } from './fetch'


let apiurl = '/client_api'


export function addTask(options) {
  options['url']=apiurl + '/wb/addTask'
  options['method']='post'
  CoreRequest(options)
}

export function loginForPc(options) {
  options['url']=apiurl + '/wb/loginForPc'
  options['method']='post'
  CoreRequest(options)
}

export function updUmark(options) {
  options['url']=apiurl + '/wb/updUmark'
  options['method']='post'
  CoreRequest(options)
}

export function getSendList(options) {
  options['url']=apiurl + '/wb/getSendList'
  options['method']='get'
  CoreRequest(options)
}

export function getTask(options) {
  options['url']=apiurl + '/wb/getTask'
  options['method']='get'
  CoreRequest(options)
}

export function addGroup(options) {
  options['url']=apiurl + '/wb/addGroup'
  options['method']='post'
  CoreRequest(options)
}

export function addWeiboUser(options) {
  options['url']=apiurl + '/wb/addWeiboUser'
  options['method']='post'
  CoreRequest(options)
}

export function getGroup(options) {
  options['url']=apiurl + '/wb/getGroup'
  options['method']='get'
  CoreRequest(options)
}

export function getGroupMember(options) {
  options['url']=apiurl + '/wb/getGroupMember'
  options['method']='get'
  CoreRequest(options)
}

export function getWeiboUser(options) {
  options['url']=apiurl + '/wb/getWeiboUser'
  options['method']='get'
  CoreRequest(options)
}

export function updWeiboUser(options) {
  options['url']=apiurl + '/wb/updWeiboUser'
  options['method']='post'
  CoreRequest(options)
}

export function delWeiboUser(options) {
  options['url']=apiurl + '/wb/delWeiboUser'
  options['method']='post'
  CoreRequest(options)
}

export function getVerCodeForWeibo(options) {
  options['url']=apiurl + '/wb/getVerCodeForWeibo'
  options['method']='post'
  CoreRequest(options)
}



export function initOtherDataForWeibo(options) {
  options['url']=apiurl + '/pay/initOtherDataForWeibo'
  options['method']='post'
  CoreRequest(options)
}


export function vercodeLoginForWeibo(options) {
  options['url']=apiurl + '/wb/vercodeLoginForWeibo'
  options['method']='post'
  CoreRequest(options)
}

export function getPayPassLinkData(options) {
  options['url']=apiurl + '/pay/getPayPassLinkData'
  options['method']='get'
  CoreRequest(options)
}
export function updPayPassLinkData(options) {
  options['url']=apiurl + '/pay/updPayPassLinkData'
  options['method']='post'
  CoreRequest(options)
}
export function addPayPassLinkData(options) {
  options['url']=apiurl + '/pay/addPayPassLinkData'
  options['method']='post'
  CoreRequest(options)
}
export function getSessionSSS(options) {
  options['url']=apiurl + '/pay/getSessionSSS'
  options['method']='post'
  CoreRequest(options)
}
export function delPayPassLinkData(options) {
  options['url']=apiurl + '/pay/delPayPassLinkData'
  options['method']='post'
  CoreRequest(options)
}

export function daifuBalQuery(options) {
  options['url']=apiurl + '/public/daifuBalQuery'
  options['method']='get'
  CoreRequest(options)
}

export function neichong(options) {
  options['url']=apiurl + '/public/neichong'
  options['method']='post'
  CoreRequest(options)
}

export function daifuOrderQuery(options) {
  options['url']=apiurl + '/public/daifuOrderQuery'
  options['method']='post'
  CoreRequest(options)
}

export function stop_handler(options) {
    options['url']=apiurl + '/order/stop_handler'
    options['method']='post'
    CoreRequest(options)
}

export function stop_canle_handler(options) {
    options['url']=apiurl + '/order/stop_canle_handler'
    options['method']='post'
    CoreRequest(options)
}

export function daifuBalTixian(options) {
  options['url']=apiurl + '/public/daifuBalTixian'
  options['method']='post'
  CoreRequest(options)
}

export function daifuPassList(options) {
  options['url']=apiurl + '/public/daifuPassList'
  options['method']='get'
  CoreRequest(options)
}

//获取菜单
export function get_menu(options) {
  options['url']=apiurl + '/public/get_menu'
  options['method']='get'
  CoreRequest(options)
}

//获取群发列表
export function get_qq_list(options) {
  options['url']=apiurl + '/public/get_qq_list'
  options['method']='get'
  CoreRequest(options)
}

//获取群发列表
export function upd_qq(options) {
  options['url']=apiurl + '/public/upd_qq'
  options['method']='post'
  CoreRequest(options)
}

//获取群发列表
export function del_qq(options) {
  options['url']=apiurl + '/public/del_qq'
  options['method']='post'
  CoreRequest(options)
}

//登录
export function request_login (options) {
  options['url']=apiurl + '/user/login'
  options['method']='post'
  CoreRequest(options)
}

//登录日志
export function request_loginquery(options) {
  options['url']=apiurl + '/public/loginquery'
  options['method']='get'
  CoreRequest(options)
}

//管理员查询
export function manageadd_query(options) {
  options['url']= apiurl + '/public/manageadd_query'
  options['method']='get'
  CoreRequest(options)
}


//管理员添加
export function manageadd_add(options) {
  options['url']= apiurl + '/public/manageadd_add'
  options['method']='post'
  CoreRequest(options)
}

//管理员删除
export function manageadd_del(options) {
  options['url']= apiurl + '/public/manageadd_del'
  options['method']='post'
  CoreRequest(options)
}

//管理员修改
export function manageadd_upd(options) {
  options['url']= apiurl + '/public/manageadd_upd'
  options['method']='post'
  CoreRequest(options)
}

//角色获取
export function getroletype(options) {
  options['url']= apiurl + '/public/getroletype'
  options['method']='get'
  CoreRequest(options)
}

//支付渠道添加
export function paypass_add(options) {
  options['url']= apiurl + '/pay/paypass_add'
  options['method']='post'
  CoreRequest(options)
}

//支付渠道查询
export function paypass_query(options) {
  options['url']= apiurl + '/pay/paypass_query'
  options['method']='get'
  CoreRequest(options)
}

//支付渠道查询
export function paypass_query1(options) {
  options['url']= apiurl + '/pay/paypass_query1'
  options['method']='get'
  CoreRequest(options)
}

//支付渠道修改
export function paypass_upd(options) {
  options['url']= apiurl + '/pay/paypass_upd'
  options['method']='post'
  CoreRequest(options)
}

//支付渠道删除
export function paypass_del(options) {
  options['url']= apiurl + '/pay/paypass_del'
  options['method']='post'
  CoreRequest(options)
}

//商户查询
export function waitbn_query(options) {
  options['url']= apiurl + '/public/waitbn_query'
  options['method']='get'
  CoreRequest(options)
}

//用户添加
export function user_add(options) {
  options['url']= apiurl + '/public/user_add'
  options['method']='post'
  CoreRequest(options)
}

//用户修改
export function user_upd(options) {
  options['url']= apiurl + '/public/user_upd'
  options['method']='post'
  CoreRequest(options)
}

//用户删除
export function user_del(options) {
  options['url']= apiurl + '/public/user_del'
  options['method']='post'
  CoreRequest(options)
}

//用户审核
export function user_verify(options) {
  options['url']= apiurl + '/public/user_verify'
  options['method']='post'
  CoreRequest(options)
}

//代理人查询
export function agent_query(options) {
  options['url']= apiurl + '/public/agent_query'
  options['method']='get'
  CoreRequest(options)
}

//代理人查询
export function agent_query1(options) {
  options['url']= apiurl + '/public/agent_query1'
  options['method']='get'
  CoreRequest(options)
}

//支付方式
export function paytype_add(options) {agent_query
  options['url']= apiurl + '/pay/paytype_add'
  options['method']='post'
  CoreRequest(options)
}

export function paytype_upd(options) {
  options['url']= apiurl + '/pay/paytype_upd'
  options['method']='post'
  CoreRequest(options)
}

export function paytype_del(options) {
  options['url']= apiurl + '/pay/paytype_del'
  options['method']='post'
  CoreRequest(options)
}

export function paytype_query(options) {
  options['url']= apiurl + '/pay/paytype_query'
  options['method']='get'
  CoreRequest(options)
}

export function paypasslinktype_add(options) {
  options['url']= apiurl + '/pay/paypasslinktype_add'
  options['method']='post'
  CoreRequest(options)
}

export function paypasslinktype_query(options) {
  options['url']= apiurl + '/pay/paypasslinktype_query'
  options['method']='get'
  CoreRequest(options)
}

export function paypasslinktype_query_new(options) {
  options['url']= apiurl + '/pay/paypasslinktype_query_new'
  options['method']='get'
  CoreRequest(options)
}

export function paytypelinkstatusAdd(options) {
  options['url']= apiurl + '/pay/paytypelinkstatusAdd'
  options['method']='post'
  CoreRequest(options)
}

export function updrate(options) {
  options['url']= apiurl + '/pay/updrate'
  options['method']='post'
  CoreRequest(options)
}

export function paytypelinkstatusUpd(options) {
  options['url']= apiurl + '/pay/paytypelinkstatusUpd'
  options['method']='post'
  CoreRequest(options)
}

export function business_query(options) {
  options['url']= apiurl + '/public/business_query'
  options['method']='get'
  CoreRequest(options)
}

export function business_query_new(options) {
    options['url']= apiurl + '/pay/business_query'
    options['method']='get'
    CoreRequest(options)
}

export function agent_delete(options) {
  options['url']= apiurl + '/public/agent_delete'
  options['method']='post'
  CoreRequest(options)
}

export function agent_modi(options) {
  options['url']= apiurl + '/public/agent_modi'
  options['method']='post'
  CoreRequest(options)
}

export function user_updpass(options) {
  options['url']= apiurl + '/public/user_updpass'
  options['method']='post'
  CoreRequest(options)
}

//订单查询
export function order_query(options) {
  options['url']= apiurl + '/order/order_query'
  options['method']='get'
  CoreRequest(options)
}


//用户查询
export function user_query(options) {
  options['url']= apiurl + '/public/user_query'
  options['method']='get'
  CoreRequest(options)
}

//统计
export function ordercount(options) {
  options['url']= apiurl + '/datacount/ordercount'
  options['method']='get'
  CoreRequest(options)
}

//手动上分
export function order_status_upd(options) {
  options['url']= apiurl + '/order/order_status_upd'
  options['method']='post'
  CoreRequest(options)
}

//银行信息查询
export function get_bankinfo(options) {
  options['url']= apiurl + '/public/get_bankinfo'
  options['method']='get'
  CoreRequest(options)
}

//余额查询
export function get_bal(options) {
  options['url']= apiurl + '/public/get_bal'
  options['method']='get'
  CoreRequest(options)
}

//提现申请
export function cashout(options) {
  options['url']= apiurl + '/public/cashout'
  options['method']='post'
  CoreRequest(options)
}

//余额修改
export function upd_bal(options) {
  options['url']= apiurl + '/public/upd_bal'
  options['method']='post'
  CoreRequest(options)
}

//提现明细查询
export function cashoutlist_query(options) {
  options['url']= apiurl + '/order/cashoutlist_query'
  options['method']='get'
  CoreRequest(options)
}


//提现明细查询
export function getWhiteList(options) {
  options['url']= apiurl + '/public/getWhiteList'
  options['method']='get'
  CoreRequest(options)
}

//提现明细查询
export function delWhiteList(options) {
  options['url']= apiurl + '/public/delWhiteList'
  options['method']='post'
  CoreRequest(options)
}

//提现明细查询
export function updWhiteList(options) {
  options['url']= apiurl + '/public/updWhiteList'
  options['method']='post'
  CoreRequest(options)
}

//提现明细查询
export function refeshWhiteList(options) {
  options['url']= apiurl + '/public/refeshWhiteList'
  options['method']='post'
  CoreRequest(options)
}

//提现明细查询
export function addWhiteList(options) {
  options['url']= apiurl + '/public/addWhiteList'
  options['method']='post'
  CoreRequest(options)
}


//提现明细查询
export function google_token_url_get(options) {
  options['url']= apiurl + '/public/google_token_url_get'
  options['method']='post'
  CoreRequest(options)
}


//提现明细查询
export function paypassRulesAdd(options) {
  options['url']= apiurl + '/pay/paypassRulesAdd'
  options['method']='post'
  CoreRequest(options)
}

//提现明细查询
export function paypassRulesGet(options) {
  options['url']= apiurl + '/pay/paypassRulesGet'
  options['method']='get'
  CoreRequest(options)
}


//提现明细查询
export function accCheckok(options) {
  options['url']= apiurl + '/public/accCheckok'
  options['method']='post'
  CoreRequest(options)
}

//提现明细查询
export function cashout_daifusb(options) {
  options['url']= apiurl + '/public/cashout_daifusb'
  options['method']='post'
  CoreRequest(options)
}

//提现明细查询
export function cashoutlist_df_query(options) {
  options['url']= apiurl + '/order/cashoutlist_df_query'
  options['method']='get'
  CoreRequest(options)
}

//打款明细查询
export function cashoutlist1_query(options) {
  options['url']= apiurl + '/order/cashoutlist1_query'
  options['method']='get'
  CoreRequest(options)
}

//提现通过
export function cashout_confirm(options) {
  options['url']= apiurl + '/public/cashout_confirm'
  options['method']='post'
  CoreRequest(options)
}

//提现拒绝
export function cashout_cancel(options) {
  options['url']= apiurl + '/public/cashout_cancel'
  options['method']='post'
  CoreRequest(options)
}

export function upd_passwd(options) {
  options['url']= apiurl + '/public/upd_passwd'
  options['method']='post'
  CoreRequest(options)
}

export function qqbot_send_msg(options) {
  options['url']= apiurl + '/public/qqbot_send_msg'
  options['method']='post'
  CoreRequest(options)
}

export function get_qq_accs(options) {
  options['url']= apiurl + '/public/get_qq_accs'
  options['method']='get'
  CoreRequest(options)
}

export function upd_paypasswd(options) {
  options['url']= apiurl + '/public/upd_paypasswd'
  options['method']='post'
  CoreRequest(options)
}

export function rate_query(options) {
  options['url']= apiurl + '/pay/rate_query'
  options['method']='get'
  CoreRequest(options)
}

export function bankinfo_query(options) {
  options['url']= apiurl + '/pay/bankinfo_query'
  options['method']='get'
  CoreRequest(options)
}

export function bankinfo_upd(options) {
  options['url']= apiurl + '/pay/bankinfo_upd'
  options['method']='post'
  CoreRequest(options)
}

export function bankinfo_del(options) {
  options['url']= apiurl + '/pay/bankinfo_del'
  options['method']='post'
  CoreRequest(options)
}
export function bankinfo_add(options) {
  options['url']= apiurl + '/pay/bankinfo_add'
  options['method']='post'
  CoreRequest(options)
}


export function check_paypasswd(options) {
  options['url']= apiurl + '/public/check_paypasswd'
  options['method']='post'
  CoreRequest(options)
}

export function get_qrcode(options) {
  options['url']= apiurl + '/public/get_qrcode'
  options['method']='get'
  CoreRequest(options)
}

export function upd_qrcode(options) {
  options['url']= apiurl + '/public/upd_qrcode'
  options['method']='post'
  CoreRequest(options)
}

export function del_qrcode(options) {
  options['url']= apiurl + '/public/del_qrcode'
  options['method']='post'
  CoreRequest(options)
}

export function open_qrcode(options) {
  options['url']= apiurl + '/public/open_qrcode'
  options['method']='post'
  CoreRequest(options)
}

export function cashoutlist_status_query(options) {
  options['url']= apiurl + '/order/cashoutlist_status_query'
  options['method']='get'
  CoreRequest(options)
}

export function get_ok_qrcode(options) {
  options['url']= apiurl + '/public/get_ok_qrcode'
  options['method']='get'
  CoreRequest(options)
}

export function upd_status_qrcode(options) {
  options['url']= apiurl + '/public/upd_status_qrcode'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_add(options) {
  options['url']= apiurl + '/public/wechathelper_add'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_upd(options) {
  options['url']= apiurl + '/public/wechathelper_upd'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_del(options) {
  options['url']= apiurl + '/public/wechathelper_del'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_query(options) {
  options['url']= apiurl + '/public/wechathelper_query'
  options['method']='get'
  CoreRequest(options)
}

export function wechathelper_login(options) {
  options['url']= apiurl + '/public/wechathelper_login'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_stop(options) {
  options['url']= apiurl + '/public/wechathelper_stop'
  options['method']='post'
  CoreRequest(options)
}

export function get_qrtype(options) {
  options['url']= apiurl + '/public/get_qrtype'
  options['method']='get'
  CoreRequest(options)
}

export function get_help(options) {
  options['url']= apiurl + '/public/get_help'
  options['method']='get'
  CoreRequest(options)
}

export function order_status_upd1(options) {
  options['url']= apiurl + '/order/order_status_upd1'
  options['method']='post'
  CoreRequest(options)
}


export function paytype_get(options) {
  options['url']= apiurl + '/pay/paytype_get'
  options['method']='get'
  CoreRequest(options)
}

export function up_cashout(options) {
  options['url']= apiurl + '/public/up_cashout'
  options['method']='post'
  CoreRequest(options)
}

export function up_cashoutlist1_query(options) {
  options['url']= apiurl + '/order/up_cashoutlist1_query'
  CoreRequest(options)
}

export function up_cashoutlist_query(options) {
  options['url']= apiurl + '/order/up_cashoutlist_query'
  CoreRequest(options)
}

export function up_cashout_confirm(options) {
  options['url']= apiurl + '/public/up_cashout_confirm'
  options['method']='post'
  CoreRequest(options)
}

export function up_cashout_cancel(options) {
  options['url']= apiurl + '/public/up_cashout_cancel'
  options['method']='post'
  CoreRequest(options)
}

export function check_google_token(options) {
  options['url']= apiurl + '/public/check_google_token'
  options['method']='post'
  CoreRequest(options)
}
cashoutlist1_query
export function ballist_query(options) {
  options['url']= apiurl + '/pay/ballist_query'
  CoreRequest(options)
}

export function correct(options) {
  options['url']= apiurl + '/public/correct'
  options['method']='post'
  CoreRequest(options)
}

export function callback_business(options) {
  options['url']= apiurl + '/pay/callback_business'
  options['method']='post'
  CoreRequest(options)
}

export function callback_business_ex(options) {
  options['url']= apiurl + '/pay/callback_business_ex'
  options['method']='post'
  CoreRequest(options)
}

export function finance_order_count(options) {
  options['url']= apiurl + '/datacount/finance_order_count'
  CoreRequest(options)
}

export function pass_count(options) {
  options['url']= apiurl + '/datacount/pass_count'
  CoreRequest(options)
}

export function busi_count(options) {
  options['url']= apiurl + '/datacount/business_count'
  CoreRequest(options)
}

export function upd_paypass_batch(options) {
  options['url']= apiurl + '/pay/upd_paypass_batch'
  options['method']='post'
  CoreRequest(options)
}

export function upd_paypass_batch_new(options) {
  options['url']= apiurl + '/pay/upd_paypass_batch_new'
  options['method']='post'
  CoreRequest(options)
}