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
          <el-descriptions-item>
            <template #label><div class="cell-item">Автомобиль</div></template>
            {{ order.carMake }}, {{ order.regNumber }}, {{ order.truckload }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label><div class="cell-item">Плановый период рейса</div></template>
            {{ formatDateTime(dateFromString(order.startDatePlan!)) }} -
            {{ formatDateTime(dateFromString(order.endDatePlan!)) }}
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions
          title="Отразите фактические данные рейса"
          :column="5"
          direction="vertical"
          border
          style="margin-top: 20px">
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
              :disabled="disabled"
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
              :disabled="disabled"
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
              :disabled="disabled"
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
              :disabled="disabled"
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
    <template #footer v-if="!disabled">
      <div class="dialog-footer">
        <el-button @click="show = false">Отмена</el-button>
        <el-button type="primary" @click="saveTrip">Завершить заказ</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useApi, useDate } from '@/hooks'
import { useOrdersStore } from '@/stores'
import { DateTimeFormat, DateValueFormat, TimeFormat } from '@ag-resourse-logistic/core'
import { Van } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { Order } from '@ag-resourse-logistic/core'
import { useReferences } from '@/hooks'
import { formatNumber } from '@/utils'

const api = useApi()
const { formatDateTime, dateFromString } = useDate()
const store = useOrdersStore()
const refs = useReferences()

const order = ref<Order>()
const disabled = computed(() => order.value?.status !== 'planned')
const title = computed(
  () => `${disabled.value ? 'Просмотр' : 'Завершение'} рейса по заказу № ${order.value?.id}`
)

const show = ref(false)

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
const tripTime = ref(dayjs('0001-01-01').hour(2).format(DateValueFormat))
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

const saveTrip = async () => {
  const savingOrder = order.value
  if (!savingOrder?.id) return

  const result = await api.put<Order>('orders', savingOrder.id, {
    ...savingOrder,
    startDate: startDate.value,
    departureDate: departureDate.value,
    arrivalDate: arrivalDate.value,
    endDate: endDate.value,
    status: 'finished'
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
    startDate.value = currentOrder.startDatePlan!
    order.value = currentOrder
    show.value = true
  }
})
</script>
