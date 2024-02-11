<template>
  <el-dialog v-model="show" :title="title" width="80%">
    <div style="position: relative; overflow: hidden">
      <a
        href="https://yandex.ru/maps?utm_medium=mapframe&utm_source=maps"
        style="color: #eee; font-size: 12px; position: absolute; top: 0px"
        >Яндекс Карты</a
      ><a
        href="https://yandex.ru/maps/?ll=37.547495%2C54.983512&mode=routes&rtext=55.755864%2C37.617698~54.193122%2C37.617348&rtt=auto&ruri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1MzAwMDA5NBIa0KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAiCg2GeBZCFQEGX0I%2C~ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1MzA1NzEzMxIW0KDQvtGB0YHQuNGPLCDQotGD0LvQsCIKDSp4FkIVwsVYQg%2C%2C&utm_medium=mapframe&utm_source=maps&z=7.88"
        style="color: #eee; font-size: 12px; position: absolute; top: 14px"
        >Яндекс Карты</a
      ><iframe
        src="https://yandex.ru/map-widget/v1/?ll=37.547495%2C54.983512&mode=routes&rtext=55.755864%2C37.617698~54.193122%2C37.617348&rtt=auto&ruri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1MzAwMDA5NBIa0KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAiCg2GeBZCFQEGX0I%2C~ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1MzA1NzEzMxIW0KDQvtGB0YHQuNGPLCDQotGD0LvQsCIKDSp4FkIVwsVYQg%2C%2C&z=7.88"
        width="100%"
        height="400"
        frameborder="1"
        allowfullscreen="true"
        style="position: relative"></iframe>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useReferences } from '@/hooks'
import type { City } from '@ag-resourse-logistic/core'
/** @todo: API call */
// const 37.547495
// https://yandex.ru/map-widget/v1/?ll=37.547495%2C54.983512&mode=routes&rtext=55.755864%2C37.617698~54.193122%2C37.617348
const refs = useReferences()

const show = ref(false)
const from = ref<City>()
const to = ref<City>()
const title = computed(
  () => `Просмотр маршрута ${from.value?.presentation} - ${to.value?.presentation}`
)

defineExpose({
  open: (cityFrom?: string, cityTo?: string) => {
    if (cityFrom) {
      from.value = refs.Cities.get(cityFrom)
    }
    if (cityTo) {
      to.value = refs.Cities.get(cityTo)
    }
    show.value = true
  }
})
</script>
