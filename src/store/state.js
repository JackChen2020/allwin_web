
let defaultAuthorization = ''
let defaultUser = {}

try {
  if (localStorage.authorization) {
    defaultAuthorization = localStorage.authorization
  }
} catch(e) {}

try {
  if (localStorage.user) {
    defaultUser = JSON.parse(window.localStorage.getItem('user'));
  }
} catch(e) {}

export default {
  authorization: defaultAuthorization,
  user: defaultUser,
  editableTabsEx:[],
  editableTabsValueEx:'0',
  routers:[],
}
