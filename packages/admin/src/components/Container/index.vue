<template>
  <div :class="$style.page">
    <div :class="$style.pageHeader">
      <el-page-header v-if="hasArror" :content="title" @back="go2Back" />
      <div v-else class="el-page-header__content">{{ title }}</div>
    </div>
    <div :class="$style.pageBody">
      <slot></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  title: String,
  hasArror: {
    type: Boolean,
    default: true,
  },
})
const emits = defineEmits<{
  (e: 'back'): void
}>()
const go2Back = () => {
  emits('back')
}
</script>

<style lang="scss" module>
.page {
  &Header {
    padding: 24px;
    border-bottom: var(--el-border-base);
    background: #fff;
    // border: $--border-base;
  }
  &Body {
    padding: 24px;
  }
}
</style>
