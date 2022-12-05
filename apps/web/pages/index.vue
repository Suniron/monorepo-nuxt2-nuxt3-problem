<template>
  <div>
    Hello world
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  middleware({ redirect, store }) {
    const path = store.state.user.session ? '/dashboard' : '/sign-in'
    redirect(path)
  }
}
</script>
