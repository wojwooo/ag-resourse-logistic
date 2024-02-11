<template>
  <el-dialog v-model="show" :title="title" width="80%">
    <el-row>
      <el-col :span="18">
        <el-descriptions title="Данные заказа" v-if="order" :column="2" border>
          <el-descriptions-item>
            <template #label><div class="cell-item">Откуда</div></template>
            {{ refs.Cities.get(order.cityFrom!)?.presentation }}, {{ order.addressFrom }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label><div class="cell-item">От кого</div></template>
            {{ order.contactsFrom }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label><div class="cell-item">Куда</div></template>
            {{ refs.Cities.get(order.cityTo!)?.presentation }}, {{ order.addressTo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label><div class="cell-item">Кому</div></template>
            {{ order.contactsTo }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label><div class="cell-item">Груз</div></template>
            {{ order.freight }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label><div class="cell-item">Вес груза, кг</div></template>
            {{ formatNumber(order.weight) }}
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions title="Выберете автомобиль" style="margin-top: 20px"></el-descriptions>

        <el-table
          v-loading="loading"
          :data="tracks"
          style="width: 100%; margin-bottom: 20px"
          highlight-current-row
          max-height="250"
          table-layout="auto"
          @current-change="setActiveRow">
          <el-table-column v-for="column in columns" :key="column.prop" v-bind="column" />
        </el-table>

        <el-descriptions title="Запланируйте рейс" :column="5" direction="vertical" border>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">Начало рейса</div>
            </template>
            <!--
              @todo: не давать выбрать дату меньшую даты minDate у текущей строки 
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes" -->
            <el-time-picker
              v-model="startDate"
              :format="DateTimeFormat"
              :value-format="DateValueFormat"
              :clearable="false"
              style="width: 150px" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">Время погрузки</div>
            </template>
            <el-time-picker
              v-model="loadingTime"
              :format="TimeFormat"
              :value-format="DateValueFormat"
              :clearable="false"
              style="width: 80px" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">Время в пути</div>
            </template>
            <el-time-picker
              v-model="tripTime"
              :format="TimeFormat"
              :value-format="DateValueFormat"
              :clearable="false"
              style="width: 80px" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">Время разгрузки</div>
            </template>
            <el-time-picker
              v-model="uploadingTime"
              :format="TimeFormat"
              :value-format="DateValueFormat"
              :clearable="false"
              style="width: 80px" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">Завершение рейса</div>
            </template>
            <el-time-picker
              v-model="endDate"
              disabled
              :format="DateTimeFormat"
              :value-format="DateValueFormat"
              :clearable="false"
              style="width: 150px" />
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="6">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in timeline"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :size="activity.size"
            :timestamp="activity.timestamp">
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="show = false">Отмена</el-button>
        <el-button type="primary" :disabled="!activeRow" @click="saveTrip">Создать</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApi, useColumns, useDate, useReferences } from '@/hooks'
import { useOrdersStore } from '@/stores'
import { formatNumber } from '@/utils'
import { DateTimeFormat, DateValueFormat, TimeFormat } from '@ag-resourse-logistic/core'
import { Van } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { AvailableTrack, AvailableTracks, Order } from '@ag-resourse-logistic/core'

const api = useApi()
const { formatDateTime, dateFromString } = useDate()
const { setColumnsFormatter } = useColumns()
const store = useOrdersStore()
const refs = useReferences()

const columns = setColumnsFormatter([
  { prop: 'state', label: 'Состояние' },
  { prop: 'carMake', label: 'Марка' },
  { prop: 'regNumber', label: 'Гос. номер' },
  { prop: 'truckload', label: 'Грузоподъемность' },
  { prop: 'minDate', label: 'Свободен с', type: 'time' },
  { prop: 'position', label: 'Местонахождение' }
])

const currentDate = ref(dayjs().startOf('day'))
const order = ref<Order>()
const title = computed(() => `Планирование рейса по заказу № ${order.value?.id}`)

const loading = ref(false)
const show = ref(false)
const tracks = ref<AvailableTracks>([])
const activeRow = ref<AvailableTrack>()

//Прибытие на точку погрузки
const startDate = ref(dayjs().startOf('day').format(DateValueFormat))
const loadingTime = ref(dayjs('0001-01-01').hour(1).format(DateValueFormat))
//Отправление (позгузка завершена)
const departureDate = computed(() => {
  const _startDate = dayjs(startDate.value, DateValueFormat)
  const _loadingTime = dayjs(loadingTime.value, DateValueFormat)
  return _startDate
    .hour(_startDate.hour() + _loadingTime.hour())
    .minute(_startDate.minute() + _loadingTime.minute())
    .format(DateValueFormat)
})
const tripTime = ref(dayjs('0001-01-01').hour(1).format(DateValueFormat))
//Прибытие (начало разгрузки)
const arrivalDate = computed(() => {
  const _departureDate = dayjs(departureDate.value, DateValueFormat)
  const _tripTime = dayjs(tripTime.value, DateValueFormat)
  return _departureDate
    .hour(_departureDate.hour() + _tripTime.hour())
    .minute(_departureDate.minute() + _tripTime.minute())
    .format(DateValueFormat)
})
const uploadingTime = ref(dayjs('0001-01-01').hour(1).format(DateValueFormat))
//Завершение рейса (разгрузки)
const endDate = computed(() => {
  const _arrivalDate = dayjs(arrivalDate.value, DateValueFormat)
  const _uploadingTime = dayjs(uploadingTime.value, DateValueFormat)
  return _arrivalDate
    .hour(_arrivalDate.hour() + _uploadingTime.hour())
    .minute(_arrivalDate.minute() + _uploadingTime.minute())
    .format(DateValueFormat)
})

const setActiveRow = (currentRow?: AvailableTrack) => {
  if (!currentRow) return
  activeRow.value = currentRow
  startDate.value = currentRow.minDate
  console.log('setActiveRow', currentRow)
}

const timeline = computed(() => [
  {
    content: 'Прибытие на точку погрузки',
    timestamp: dayjs(startDate.value, DateValueFormat).format(DateTimeFormat)
  },
  {
    content: 'Отправление (позгузка завершена)',
    timestamp: dayjs(departureDate.value, DateValueFormat).format(DateTimeFormat),
    size: 'large' as const,
    type: 'primary' as const,
    icon: Van
  },
  {
    content: 'Прибытие (начало разгрузки)',
    timestamp: dayjs(arrivalDate.value, DateValueFormat).format(DateTimeFormat),
    size: 'large' as const,
    type: 'warning' as const,
    icon: Van
  },
  {
    content: 'Завершение рейса (разгрузки)',
    timestamp: dayjs(endDate.value, DateValueFormat).format(DateTimeFormat),
    type: 'success' as const
  }
])

const fetch = async () => {
  loading.value = true
  await setTimeout(() => {
    /** @todo: API call */
    tracks.value = [
      {
        state: 'Рейс Моска - Тула',
        carMake: 'Газель',
        regNumber: 'AA 888 A 777',
        truckload: 1.5,
        minDate: currentDate.value.hour(15).minute(20).format(DateValueFormat),
        position: 'ул. Мира, 15'
      },
      {
        state: 'Рейс Моска - Тула',
        carMake: 'Камаз',
        regNumber: 'BB 666 B 799',
        truckload: 15,
        minDate: currentDate.value.hour(15).minute(20).format(DateValueFormat),
        position: 'ул. Свободы, 42 '
      },
      {
        state: 'Свободен',
        carMake: 'Камаз',
        regNumber: 'BB 666 B 799',
        truckload: 15,
        minDate: currentDate.value.hour(15).minute(20).format(DateValueFormat),
        position: 'ул. Свободы, 42 '
      },
      {
        state: 'Свободен',
        carMake: 'Камаз',
        regNumber: 'BB 666 B 799',
        truckload: 15,
        minDate: currentDate.value.hour(15).minute(20).format(DateValueFormat),
        position: 'ул. Свободы, 42 '
      }
    ]
  }, 200)
  loading.value = false
}

const saveTrip = async () => {
  const savingOrder = order.value
  if (!savingOrder?.id || !activeRow.value) return

  const result = await api.put<Order>('orders', savingOrder.id, {
    ...savingOrder,
    carMake: activeRow.value.carMake,
    regNumber: activeRow.value.regNumber,
    truckload: activeRow.value.truckload,
    startPosition: activeRow.value.position,
    startDatePlan: startDate.value,
    departureDatePlan: departureDate.value,
    arrivalDatePlan: arrivalDate.value,
    endDatePlan: endDate.value,
    status: 'planned'
  })

  if (result) {
    const index = store.orders.findIndex((el) => el.id === result.id)
    if (index > -1) {
      store.orders[index] = result
      show.value = false
    }
  }
}

defineExpose({
  open: (currentOrder: Order) => {
    currentDate.value = dayjs(currentOrder.date, DateValueFormat)
    order.value = currentOrder
    activeRow.value = undefined
    fetch()
    show.value = true
  }
})
</script>
