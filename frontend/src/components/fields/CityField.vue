<template>
  <el-select
    clearable
    filterable
    :placeholder="placeholder"
    :model-value="modelValue"
    @update:model-value="(value) => $emit('update:model-value', value)">
    <el-option
      v-for="item in refs.Cities.values()"
      :key="item.id"
      :label="item.presentation"
      :value="item.id" />
  </el-select>
</template>

<script setup lang="ts">
import { useReferences } from '@/hooks'

defineProps<{ modelValue?: string; placeholder?: string }>()
defineEmits(['update:model-value'])

const refs = useReferences()
</script>
