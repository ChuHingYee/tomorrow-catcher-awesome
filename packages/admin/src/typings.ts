// typings.d.ts or router.ts
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    label: string
    icon?: string
    auth?: string[]
    isHiddenChild: boolean
    hidden: boolean
  }
}
