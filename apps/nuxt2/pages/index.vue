<script>
export default {
  middleware({ redirect, store }) {
    const path = store.state.user.session ? '/dashboard' : '/sign-in'
    redirect(path)
  },
  name: 'HomePage'
}
</script>

<template>
  <div>
    Hello world
  </div>
</template>
