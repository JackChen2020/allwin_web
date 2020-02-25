<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'" >
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<!--<el-col :span="20">-->
				<!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
					<!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
					<!--<el-breadcrumb-item :to="{path: '/test'}">活动管理</el-breadcrumb-item>-->
					<!--<el-breadcrumb-item>活动列表</el-breadcrumb-item>-->
					<!--<el-breadcrumb-item>活动详情</el-breadcrumb-item>-->
				<!--</el-breadcrumb>-->
			<!--</el-col>-->
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img src="../assets/img/pichead.jpg"/> {{user.name}}</span>
					<el-dropdown-menu slot="dropdown">
						<!--<el-dropdown-item>我的消息</el-dropdown-item>-->
						<!--<el-dropdown-item>设置</el-dropdown-item>-->
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'"  >
				<!--导航菜单-->
				<el-menu style="overflow:auto;" :default-active="$route.path" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed" >
					<template v-for="(item,index) in Homerouters" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf"  >
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">{{child.name}}</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in Homerouters" v-if="!item.hidden" class="el-submenu item">
						<template v-if="!item.leaf">
							<div class="el-submenu__title" style="padding-left: 20px" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li v-for="child in item.children" v-if="!child.hidden" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.path==item.children[0].path?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<!--<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="handlerTab">-->
						<!--<el-tab-pane-->
								<!--v-for="(item, index) in editableTabs"-->
								<!--:key="item.name"-->
								<!--:label="item.title"-->
								<!--:name="item.name"-->
						<!--&gt;-->
						<!--</el-tab-pane>-->
					<!--</el-tabs>-->
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<!--<keep-alive>-->
								<!--<router-view></router-view>-->
							<!--</keep-alive>-->
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import { mapState,mapMutations } from 'vuex'
	export default {
		data() {
			return {
				sysName:'三星管理系统',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '../assets/img/pichead.jpg',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				editableTabsValue: '0',
				editableTabs: [],
				tabIndex: 0,
                Homerouters:[]
			}
		},
		computed: {
			...mapState(['editableTabsEx','editableTabsValueEx','user','routers'])
		},
		methods: {
			...mapMutations(['handleEditableTabsEx','handleEditableTabsValueEx','handlerRouters']),
			onSubmit() {
				// console.log('submit!');
			},
			handlerTab(targetName){

				let tabs = this.editableTabs;
				tabs.forEach((tab, index) => {
					if (tab['name'] === targetName['name'] ){
						this.$router.push({ path: tab['path'] });
					}
				});
			},
			addTab(title,path) {
				let newTabName = ++this.tabIndex + '';
				let newTitle = title
				let newPath = path
				this.editableTabs.push({
					title:newTitle,
					name: newTabName,
					path: newPath
				});
				this.editableTabsValue = newTabName;
				this.handleEditableTabsEx(this.editableTabs)
				this.handleEditableTabsValueEx(this.editableTabsValue)
			},
			removeTab(targetName) {
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}

				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);
				if (targetName==="1"){
					this.$router.push({ path: '/' });
				} else{
					tabs.forEach((tab, index) => {
						let TestName=String(targetName-1)
						if (tab.name === TestName) {
							this.editableTabsValue = TestName
							this.$router.push({ path: tab.path });
						}
					})
				}
				this.handleEditableTabsEx(this.editableTabs)
				this.handleEditableTabsValueEx(this.editableTabsValue)
			},
			handleopen() {
				// console.log('handleopen');
			},
			handleclose() {
				// console.log('handleclose');
			},
			handleselect: function (a,b) {
				this.Homerouters[b[0]]['children'].forEach((item,index) => {
					if (a === item['path']){
						this.addTab(item['name'],item['path'])
					}
				})
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					// sessionStorage.removeItem('user');
					// localStorage.authorization = ""
					localStorage.clear()
                    this.handlerRouters([])
                    
					_this.$router.push('/login');
				}).catch(() => {

				});
			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {

			this.editableTabs = this.editableTabsEx
			this.editableTabsValue = this.editableTabsValueEx

			// console.log("user:",this.user)

			if(this.user.rolecode.toString() === "1000"){
				this.sysName = "三星管理后台"
			}else if (this.user.rolecode.toString() === "1001"){
				this.sysName = "三星管理后台"
			}else if (this.user.rolecode.toString() === "1005"){
				this.sysName = "三星财务管理后台"
			}else if (this.user.rolecode.toString() === "2001"){
				this.sysName = "三星商户后台"
			}else if (this.user.rolecode.toString() === "3001"){
				this.sysName = "三星代理后台"
			}else if (this.user.rolecode.toString() === "4001"){
				this.sysName = "三星码商后台"
			}


            const hasRouters = this.routers && this.routers.length > 0
            if(hasRouters){
                this.Homerouters = this.routers
            }
		}
	}

</script>

<style scoped lang="scss">

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: #64594a;
			color:black;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 20px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				text-align: center;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:180px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				margin:0;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 180px;
				width: 180px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
					width:180px;
					background-color: #C7EDCC;
					.el-menu-item{
						min-width:180px;
						background-color: #C7EDCC;
					}
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 180px;
				width: 180px;
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 10px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 180px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
			}
		}
	}
</style>
