import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import a from '@/components/a'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Hello',
    component: HelloWorld
  }, {
    path: '/a',
    name: 'a',
    component: a
  }]
})
