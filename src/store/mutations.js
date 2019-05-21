export default {
  handleAuthorization (state, authorization) {
    state.authorization = authorization
    try {
      localStorage.authorization = authorization
    } catch(e) {}
  },
  handleUser(state,user){
    state.user = user
    try {
      localStorage.setItem('user', JSON.stringify(user))
    } catch(e) {}
  },
  handleEditableTabsEx(state,editableTabs){
    state.editableTabsEx = editableTabs
  },
  handleEditableTabsValueEx(state,editableTabsValue){
    state.editableTabsValueEx = editableTabsValue
  },
  handlerRouters(state,routers){
    state.routers = routers
  }
}
