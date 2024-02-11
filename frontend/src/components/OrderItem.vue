<template>
  <el-dialog v-model="show" :title="title" width="80%">
    <el-form
      v-if="store.order"
      :disabled="disabled"
      ref="formRef"
      :model="store.order"
      label-position="left"
      label-width="100px"
      :rules="rules">
      <el-form-item label="Дата отправки" prop="date">
        <el-date-picker
          v-model="store.order.date"
          type="date"
          :format="DateFormat"
          :value-format="DateValueFormat"
          placeholder="Выберите дату" />
      </el-form-item>
      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item label="Откуда" prop="cityFrom">
            <CityField v-model="store.order.cityFrom" placeholder="Город" />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item prop="addressFrom" label-width="0">
            <el-input
              v-model="store.order.addressFrom"
              :rows="2"
              type="textarea"
              placeholder="адрес отправителя (улица, дом, квартира)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Контакты" prop="contactsFrom">
        <el-input
          v-model="store.order.contactsFrom"
          :rows="2"
          type="textarea"
          placeholder="Имя, телефон отправителя" />
      </el-form-item>

      <el-row :gutter="24">
        <el-col :span="10">
          <el-form-item label="Куда" prop="cityTo">
            <CityField v-model="store.order.cityTo" placeholder="Выберите город" />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item prop="addressTo" label-width="0">
            <el-input
              v-model="store.order.addressTo"
              :rows="2"
              type="textarea"
              placeholder="адрес получателя (улица, дом, квартира)" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Контакты" prop="contactsTo">
        <el-input
          v-model="store.order.contactsTo"
          :rows="2"
          type="textarea"
          placeholder="Имя, телефон получателя" />
      </el-form-item>
      <el-form-item label="Груз" prop="freight">
        <el-input
          v-model="store.order.freight"
          :rows="2"
          type="textarea"
          placeholder="Описание груза" />
      </el-form-item>
      <el-form-item label="Вес грузка, кг" prop="weight">
        <el-input-number v-model="store.order.weight" controls-position="right" />
      </el-form-item>
    </el-form>
    <template #footer v-if="!disabled">
      <div class="dialog-footer">
        <el-button @click="show = false">Отмена</el-button>
        <el-button type="primary" @click="saveOrder">{{
          store.order?.id ? 'Обновить' : 'Создать'
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/** @todo: Убрать инлайн стили */
import { computed, reactive, ref } from 'vue'
import CityField from '@/components/fields/CityField.vue'
import { DateFormat, DateValueFormat } from '@ag-resourse-logistic/core'
import { useOrdersStore } from '@/stores'
import type { Order } from '@ag-resourse-logistic/core'
import type { FormInstance, FormRules } from 'element-plus'

const store = useOrdersStore()
const formRef = ref<FormInstance>()
const show = ref(false)
const disabled = computed(
  () => store.order?.status !== 'draft' && store.order?.status !== undefined
)
const title = computed(() => (store.order?.id ? `Заказа № ${store.order.id}` : 'Новый заказ'))
const rules = reactive<FormRules<Order>>({
  date: [{ required: true, message: 'Введите дату', trigger: 'blur' }],
  cityFrom: [{ required: true, message: 'Введите город отправления', trigger: 'blur' }],
  cityTo: [{ required: true, message: 'Введите город получения', trigger: 'blur' }],
  freight: [{ required: true, message: 'Укажите груз', trigger: 'blur' }],
  weight: [{ required: true, message: 'Укажите Вес грузка', trigger: 'blur' }]
})

const saveOrder = async () => {
  if (!formRef.value) return
  let canSave = false
  await formRef.value.validate((valid) => (canSave = valid))

  if (!canSave) return
  if (!(await store.save())) return

  show.value = false
  store.order = undefined
}

defineExpose({
  show: () => {
    show.value = true
  }
})
</script>
