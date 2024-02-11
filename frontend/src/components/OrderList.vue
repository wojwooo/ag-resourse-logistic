<template>
  <div>
    <el-row>
      <el-button
        class="mt-4"
        type="success"
        style="width: 100px"
        @click="editOrder()"
        :icon="CirclePlus"
        >Новый заказ</el-button
      >
      <el-icon style="margin-left: 10px"><Filter /></el-icon>
      <div style="display: flex; width: 200px; margin-left: 10px">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="-"
          start-placeholder="c"
          end-placeholder="по" />
      </div>
      <CityField
        v-model="store.filters.cityFrom"
        placeholder="Откуда"
        style="width: 150px; margin-left: 10px" />
      <CityField
        v-model="store.filters.cityTo"
        placeholder="Куда"
        style="width: 150px; margin-left: 10px" />
      <el-select
        v-model="store.filters.status"
        clearable
        filterable
        placeholder="Статус"
        style="width: 150px; margin-left: 10px">
        <el-option
          v-for="key in Object.keys(Enums.OrderStatus)"
          :key="key"
          :label="(Enums.OrderStatus as any)[key as any]"
          :value="key" />
      </el-select>
    </el-row>
    <el-table
      v-loading="store.loading"
      :data="store.orders"
      style="width: 100%; margin-top: 10px"
      max-height="450"
      table-layout="auto"
      @row-dblclick="selectRow">
      <el-table-column v-for="column in filteredColumns" :key="column.label" v-bind="column">
        <template v-if="column.children">
          <el-table-column
            v-for="childrenColumn in column.children"
            :key="childrenColumn.prop"
            v-bind="childrenColumn">
          </el-table-column>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="200">
        <template #header>Доступные действия</template>
        <template #default="scope">
          <el-tooltip effect="dark" content="Просмотреть / изменить" placement="top">
            <el-button
              type="primary"
              circle
              :icon="Edit"
              @click.prevent="editOrder(scope.$index)" />
          </el-tooltip>
          <el-tooltip effect="dark" content="Скопировать" placement="top">
            <el-button
              type="primary"
              circle
              :icon="CopyDocument"
              @click.prevent="copyOrder(scope.$index)" />
          </el-tooltip>
          <el-tooltip
            v-if="canPlan(scope.$index)"
            effect="dark"
            content="Запланировать рейс"
            placement="top">
            <el-button type="primary" circle :icon="Van" @click.prevent="planTrip(scope.$index)" />
          </el-tooltip>
          <el-tooltip
            v-if="canFinish(scope.$index)"
            effect="dark"
            content="Отразить факт (завершить рейс)"
            placement="top">
            <el-button
              type="success"
              circle
              :icon="Van"
              @click.prevent="finishTrip(scope.$index)" />
          </el-tooltip>
          <el-tooltip
            v-if="canDelete(scope.$index)"
            effect="dark"
            content="Удалить"
            placement="top">
            <el-button
              type="danger"
              circle
              :icon="Delete"
              @click.prevent="deleteOrder(scope.$index)" />
          </el-tooltip>
          <el-tooltip effect="dark" content="Открыть маршрут на яндекс картах" placement="top">
            <el-button
              type="default"
              circle
              :icon="Location"
              @click.prevent="openMap(scope.$index)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <OrderItem ref="orderForm" />
    <TripPlanning ref="tripPlaningForm" />
    <FinishTrip ref="finishTripForm" />
    <MapView ref="mapViewForm" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  CirclePlus,
  CopyDocument,
  Edit,
  Filter,
  Delete,
  Location,
  Van
} from '@element-plus/icons-vue'
import CityField from '@/components/fields/CityField.vue'
import OrderItem from '@/components/OrderItem.vue'
import TripPlanning from '@/components/TripPlanning.vue'
import FinishTrip from '@/components/FinishTrip.vue'
import MapView from '@/components/MapView.vue'
import dayjs from 'dayjs'
import { DateValueFormat, Enums } from '@ag-resourse-logistic/core'
import { useColumns } from '@/hooks'
import { useOrdersStore } from '@/stores'
import type { Order } from '@ag-resourse-logistic/core'
import type { TableColumn } from '@/hooks'

const store = useOrdersStore()
const { setColumnsFormatter } = useColumns()

const columns = ref<TableColumn[]>([
  { prop: 'id', label: '№', type: 'int' },
  { prop: 'date', label: 'Дата заказа', type: 'date' },
  { prop: 'status', label: 'Статус', type: 'enum', enumType: 'OrderStatus' },
  { prop: 'cityFrom', label: 'Откуда', type: 'ref', referenceType: 'Cities' },
  { prop: 'addressFrom', label: 'Адрес отправления', hidden: true },
  { prop: 'cityTo', label: 'Куда', type: 'ref', referenceType: 'Cities' },
  { prop: 'addressTo', label: 'Адрес доставки', hidden: true },
  { prop: 'freight', label: 'Груз' },
  { prop: 'weight', label: 'Вес грузка, кг', type: 'int' },
  { prop: 'carMake', label: 'Марка' },
  { prop: 'regNumber', label: 'Гос. номер' },
  { prop: 'truckload', label: 'Грузоподъемность', type: 'number' },
  {
    label: 'Дата отправки',
    children: [
      { prop: 'startDatePlan', label: 'план', type: 'dateTime' },
      { prop: 'startDate', label: 'факт', type: 'dateTime' }
    ]
  },
  {
    label: 'Дата получения',
    children: [
      { prop: 'endDatePlan', label: 'план', type: 'dateTime' },
      { prop: 'endDate', label: 'факт', type: 'dateTime' }
    ]
  }
])
const filteredColumns = computed(() =>
  setColumnsFormatter(columns.value.filter((el) => !el.hidden))
)
const orderForm = ref<InstanceType<typeof OrderItem>>()
const tripPlaningForm = ref<InstanceType<typeof TripPlanning>>()
const finishTripForm = ref<InstanceType<typeof FinishTrip>>()
const mapViewForm = ref<InstanceType<typeof MapView>>()

const copyOrder = (rowIndex: number) => {
  const order = store.orders[rowIndex]
  store.order = {
    id: undefined,
    date: dayjs().startOf('day').format(DateValueFormat),
    cityFrom: order.cityFrom,
    addressFrom: order.addressFrom,
    contactsFrom: order.contactsFrom,
    cityTo: order.cityTo,
    addressTo: order.addressTo,
    contactsTo: order.contactsTo,
    freight: order.freight,
    weight: order.weight
  }
  orderForm.value?.show()
}

const editOrder = (rowIndex?: number) => {
  if (rowIndex === undefined) {
    store.order = {
      date: dayjs().startOf('day').format(DateValueFormat),
      cityFrom: store.filters.cityFrom,
      addressFrom: '',
      contactsFrom: '',
      cityTo: store.filters.cityTo,
      addressTo: '',
      contactsTo: '',
      freight: '',
      weight: undefined
    }
  } else {
    store.order = { ...store.orders[rowIndex] }
  }
  orderForm.value?.show()
}

const value1 = ref('')
const deleteOrder = async (rowIndex: number) => {
  store.remove(store.orders[rowIndex])
}
const planTrip = async (rowIndex: number) => {
  tripPlaningForm.value?.open(store.orders[rowIndex])
}
const finishTrip = async (rowIndex: number) => {
  finishTripForm.value?.open(store.orders[rowIndex])
}
const openMap = async (rowIndex: number) => {
  mapViewForm.value?.open(store.orders[rowIndex].cityFrom, store.orders[rowIndex].cityTo)
}

const canDelete = (rowIndex: number) => {
  return store.orders[rowIndex].status === 'draft'
}
const canPlan = (rowIndex: number) => {
  return store.orders[rowIndex].status === 'draft'
}
const canFinish = (rowIndex: number) => {
  return store.orders[rowIndex].status === 'planned'
}

const selectRow = (order: Order) => {
  switch (order.status) {
    case 'draft':
      editOrder(store.orders.findIndex((el) => el.id === order.id))
      break
    case 'planned':
    case 'finished':
      finishTripForm.value?.open(order)
      break
    default:
      break
  }
}

watch(() => store.filters, store.get, { immediate: true, deep: true })
</script>
