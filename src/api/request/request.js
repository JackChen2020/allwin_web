
import { CoreRequest } from './fetch'

//获取菜单
export function get_menu(options) {
  options['url']='/api/public/get_menu'
  options['method']='get'
  CoreRequest(options)
}

//登录
export function request_login (options) {
  options['url']='/api/user/login'
  options['method']='post'
  CoreRequest(options)
}

//登录日志
export function request_loginquery(options) {
  options['url']='/api/public/loginquery'
  options['method']='get'
  CoreRequest(options)
}

//管理员查询
export function manageadd_query(options) {
  options['url']='/api/public/manageadd_query'
  options['method']='get'
  CoreRequest(options)
}


//管理员添加
export function manageadd_add(options) {
  options['url']='/api/public/manageadd_add'
  options['method']='post'
  CoreRequest(options)
}

//管理员删除
export function manageadd_del(options) {
  options['url']='/api/public/manageadd_del'
  options['method']='post'
  CoreRequest(options)
}

//管理员修改
export function manageadd_upd(options) {
  options['url']='/api/public/manageadd_upd'
  options['method']='post'
  CoreRequest(options)
}

//角色获取
export function getroletype(options) {
  options['url']='/api/public/getroletype'
  options['method']='get'
  CoreRequest(options)
}

//支付渠道添加
export function paypass_add(options) {
  options['url']='/api/pay/paypass_add'
  options['method']='post'
  CoreRequest(options)
}

//支付渠道查询
export function paypass_query(options) {
  options['url']='/api/pay/paypass_query'
  options['method']='get'
  CoreRequest(options)
}

//支付渠道查询
export function paypass_query1(options) {
  options['url']='/api/pay/paypass_query1'
  options['method']='get'
  CoreRequest(options)
}

//支付渠道修改
export function paypass_upd(options) {
  options['url']='/api/pay/paypass_upd'
  options['method']='post'
  CoreRequest(options)
}

//支付渠道删除
export function paypass_del(options) {
  options['url']='/api/pay/paypass_del'
  options['method']='post'
  CoreRequest(options)
}

//商户查询
export function waitbn_query(options) {
  options['url']='/api/public/waitbn_query'
  options['method']='get'
  CoreRequest(options)
}

//用户添加
export function user_add(options) {
  options['url']='/api/public/user_add'
  options['method']='post'
  CoreRequest(options)
}

//用户修改
export function user_upd(options) {
  options['url']='/api/public/user_upd'
  options['method']='post'
  CoreRequest(options)
}

//用户删除
export function user_del(options) {
  options['url']='/api/public/user_del'
  options['method']='post'
  CoreRequest(options)
}

//用户审核
export function user_verify(options) {
  options['url']='/api/public/user_verify'
  options['method']='post'
  CoreRequest(options)
}

//代理人查询
export function agent_query(options) {
  options['url']='/api/public/agent_query'
  options['method']='get'
  CoreRequest(options)
}

//代理人查询
export function agent_query1(options) {
  options['url']='/api/public/agent_query1'
  options['method']='get'
  CoreRequest(options)
}

//支付方式
export function paytype_add(options) {agent_query
  options['url']='/api/pay/paytype_add'
  options['method']='post'
  CoreRequest(options)
}

export function paytype_upd(options) {
  options['url']='/api/pay/paytype_upd'
  options['method']='post'
  CoreRequest(options)
}

export function paytype_del(options) {
  options['url']='/api/pay/paytype_del'
  options['method']='post'
  CoreRequest(options)
}

export function paytype_query(options) {
  options['url']='/api/pay/paytype_query'
  options['method']='get'
  CoreRequest(options)
}

export function paypasslinktype_add(options) {
  options['url']='/api/pay/paypasslinktype_add'
  options['method']='post'
  CoreRequest(options)
}

export function paypasslinktype_query(options) {
  options['url']='/api/pay/paypasslinktype_query'
  options['method']='get'
  CoreRequest(options)
}

// export function paytype_name_query(options) {
//   options['url']='/api/pay/paytype_name_query'
//   options['method']='get'
//   CoreRequest(options)
// }


export function business_query(options) {
  options['url']='/api/public/business_query'
  options['method']='get'
  CoreRequest(options)
}

export function agent_delete(options) {
  options['url']='/api/public/agent_delete'
  options['method']='post'
  CoreRequest(options)
}

export function agent_modi(options) {
  options['url']='/api/public/agent_modi'
  options['method']='post'
  CoreRequest(options)
}

export function user_updpass(options) {
  options['url']='/api/public/user_updpass'
  options['method']='post'
  CoreRequest(options)
}

//订单查询
export function order_query(options) {
  options['url']='/api/order/order_query'
  options['method']='get'
  CoreRequest(options)
}


//用户查询
export function user_query(options) {
  options['url']='/api/public/user_query'
  options['method']='get'
  CoreRequest(options)
}

//统计
export function ordercount(options) {
  options['url']='/api/datacount/ordercount'
  options['method']='get'
  CoreRequest(options)
}

//手动上分
export function order_status_upd(options) {
  options['url']='/api/order/order_status_upd'
  options['method']='post'
  CoreRequest(options)
}

//银行信息查询
export function get_bankinfo(options) {
  options['url']='/api/public/get_bankinfo'
  options['method']='get'
  CoreRequest(options)
}

//余额查询
export function get_bal(options) {
  options['url']='/api/public/get_bal'
  options['method']='get'
  CoreRequest(options)
}

//提现申请
export function cashout(options) {
  options['url']='/api/public/cashout'
  options['method']='post'
  CoreRequest(options)
}

//余额修改
export function upd_bal(options) {
  options['url']='/api/public/upd_bal'
  options['method']='post'
  CoreRequest(options)
}

//提现明细查询
export function cashoutlist_query(options) {
  options['url']='/api/order/cashoutlist_query'
  options['method']='get'
  CoreRequest(options)
}

//打款明细查询
export function cashoutlist1_query(options) {
  options['url']='/api/order/cashoutlist1_query'
  options['method']='get'
  CoreRequest(options)
}

//提现通过
export function cashout_confirm(options) {
  options['url']='/api/public/cashout_confirm'
  options['method']='post'
  CoreRequest(options)
}

//提现拒绝
export function cashout_cancel(options) {
  options['url']='/api/public/cashout_cancel'
  options['method']='post'
  CoreRequest(options)
}

export function upd_passwd(options) {
  options['url']='/api/public/upd_passwd'
  options['method']='post'
  CoreRequest(options)
}

export function upd_paypasswd(options) {
  options['url']='/api/public/upd_paypasswd'
  options['method']='post'
  CoreRequest(options)
}

export function rate_query(options) {
  options['url']='/api/pay/rate_query'
  options['method']='get'
  CoreRequest(options)
}

export function bankinfo_query(options) {
  options['url']='/api/pay/bankinfo_query'
  options['method']='get'
  CoreRequest(options)
}

export function bankinfo_upd(options) {
  options['url']='/api/pay/bankinfo_upd'
  options['method']='post'
  CoreRequest(options)
}

export function bankinfo_del(options) {
  options['url']='/api/pay/bankinfo_del'
  options['method']='post'
  CoreRequest(options)
}
export function bankinfo_add(options) {
  options['url']='/api/pay/bankinfo_add'
  options['method']='post'
  CoreRequest(options)
}


export function check_paypasswd(options) {
  options['url']='/api/public/check_paypasswd'
  options['method']='post'
  CoreRequest(options)
}

export function get_qrcode(options) {
  options['url']='/api/public/get_qrcode'
  options['method']='get'
  CoreRequest(options)
}

export function upd_qrcode(options) {
  options['url']='/api/public/upd_qrcode'
  options['method']='post'
  CoreRequest(options)
}

export function del_qrcode(options) {
  options['url']='/api/public/del_qrcode'
  options['method']='post'
  CoreRequest(options)
}

export function open_qrcode(options) {
  options['url']='/api/public/open_qrcode'
  options['method']='post'
  CoreRequest(options)
}

export function cashoutlist_status_query(options) {
  options['url']='/api/order/cashoutlist_status_query'
  options['method']='get'
  CoreRequest(options)
}

export function get_ok_qrcode(options) {
  options['url']='/api/public/get_ok_qrcode'
  options['method']='get'
  CoreRequest(options)
}

export function upd_status_qrcode(options) {
  options['url']='/api/public/upd_status_qrcode'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_add(options) {
  options['url']='/api/public/wechathelper_add'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_upd(options) {
  options['url']='/api/public/wechathelper_upd'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_del(options) {
  options['url']='/api/public/wechathelper_del'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_query(options) {
  options['url']='/api/public/wechathelper_query'
  options['method']='get'
  CoreRequest(options)
}

export function wechathelper_login(options) {
  options['url']='/api/public/wechathelper_login'
  options['method']='post'
  CoreRequest(options)
}

export function wechathelper_stop(options) {
  options['url']='/api/public/wechathelper_stop'
  options['method']='post'
  CoreRequest(options)
}

export function get_qrtype(options) {
  options['url']='/api/public/get_qrtype'
  options['method']='get'
  CoreRequest(options)
}

export function get_help(options) {
  options['url']='/api/public/get_help'
  options['method']='get'
  CoreRequest(options)
}

export function order_status_upd1(options) {
  options['url']='/api/order/order_status_upd1'
  options['method']='post'
  CoreRequest(options)
}


export function paytype_get(options) {
  options['url']='/api/pay/paytype_get'
  options['method']='get'
  CoreRequest(options)
}

export function up_cashout(options) {
  options['url']='/api/public/up_cashout'
  options['method']='post'
  CoreRequest(options)
}

export function up_cashoutlist1_query(options) {
  options['url']='/api/order/up_cashoutlist1_query'
  CoreRequest(options)
}

export function up_cashoutlist_query(options) {
  options['url']='/api/order/up_cashoutlist_query'
  CoreRequest(options)
}

export function up_cashout_confirm(options) {
  options['url']='/api/public/up_cashout_confirm'
  options['method']='post'
  CoreRequest(options)
}

export function up_cashout_cancel(options) {
  options['url']='/api/public/up_cashout_cancel'
  options['method']='post'
  CoreRequest(options)
}