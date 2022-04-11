import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// import { timer } from '@element-plus/icons-vue'
import * as ElIconModules from '@element-plus/icons-vue'
// 统一注册Icon图标
for (const iconName in ElIconModules) {
    if (Reflect.has(ElIconModules, iconName)) {
      const item = ElIconModules[iconName]
      app.component(iconName, item)
    }
  }



app.mount('#app')
