export default {
  methods: {
    mx_updateQueryParam({ name, value }) {
      if (Array.isArray(value))
        value = value.join(',')
      if (value === '')
        value = undefined

      // Nothing to update if the query param to update is exactly the same
      if (this.$route.query[name] === value)
        return

      this.$router
        .replace({
          path: this.$route.path,
          query: { ...this.$route.query, [name]: value },
        })
        .catch((err) => {
          // Silently catch NavigationDuplicated errors
          if (err.name !== 'NavigationDuplicated')
            throw err
        })
    },
  },
}
