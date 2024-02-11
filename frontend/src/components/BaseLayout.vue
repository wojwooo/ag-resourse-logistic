<template>
  <el-container>
    <el-header>
      <el-menu
        default-active="1"
        mode="horizontal"
        :ellipsis="false"
        @select="handleSelect">
        <img style="width: 100px" src="/logo.svg" alt="Element logo" />
        <div class="flex-grow" />
        <el-menu-item index="1">Логистика</el-menu-item>
        <el-menu-item index="2" disabled>MES</el-menu-item>
        <el-menu-item index="3" disabled>IT</el-menu-item>
        <el-menu-item index="4" disabled>Кадры</el-menu-item>
        <div class="flex-item">
          <el-switch
            v-model="isDark"
            inline-prompt
            :active-action-icon="Moon"
            :inactive-action-icon="Sunny"
            style="--el-switch-on-color: #303133; --el-switch-off-color: #e5eaf3" />
        </div>
        <div class="flex-item"><el-avatar> SV </el-avatar></div>
      </el-menu>
    </el-header>
    <el-container>
      <el-aside>
        <el-menu router :default-active="$route.path" class="left-sidebar" :collapse="isCollapse">
          <el-menu-item index="/orders" :route="{ path: '/orders', name: 'Orders' }">
            <el-icon><document /></el-icon>
            <template #title>Заказы на доставку</template>
          </el-menu-item>
          <el-sub-menu index="/references">
            <template #title>
              <el-icon><icon-menu /></el-icon>
              <span>Справочники</span>
            </template>
            <el-menu-item index="/cities" :route="{ path: '/cities', name: 'Cities' }">
              <el-icon><OfficeBuilding /></el-icon>
              <template #title><span>Города</span></template>
            </el-menu-item>
            <el-menu-item index="/routes" :route="{ path: '/routes', name: 'Routes' }">
              <el-icon><MapLocation /></el-icon>
              <template #title><span>Маршруты</span></template>
            </el-menu-item>
            <el-menu-item index="/vehicles" :route="{ path: '/vehicles', name: 'Vehicles' }">
              <template #title>
                <el-icon><Van /></el-icon>
                <span>Транспортные средства</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
// import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import {
  Document,
  Menu as IconMenu,
  MapLocation,
  OfficeBuilding,
  Van
} from '@element-plus/icons-vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

const activeIndex = ref('1')
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const isCollapse = ref(true)

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style scoped>
.layout {
  .el-main {
    height: calc(100vh - 60px);
  }
}
.el-aside {
  width: auto;
  .el-menu {
    height: calc(100vh - 60px);

    /* :not(.el-menu--collapse) {
      width: 200px;
    } */
  }
}
.flex-item {
  display: flex;
  align-items: center;
  padding: 10px;
}
</style>
