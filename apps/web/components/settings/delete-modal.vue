<template>
  <v-card>
    <v-card-title> Remove {{ whatisDeleting }} </v-card-title>
    <v-card-text>
      <v-container class="text-center">
        <v-row>
          <v-card-text>
            Do you confirm to remove the {{ whatisDeleting }}? <br /><strong
              >This action cannot be undone!</strong
            ><br /><br />
          </v-card-text>
        </v-row>
        <v-row>
          <v-col class="actions">
            <v-btn
              class="mr-2"
              :disabled="isLoading"
              @click.stop="$emit('close')"
            >
              No, cancel
            </v-btn>
            <v-btn
              color="primary"
              :loading="isLoading"
              @click.stop="emitMyEvents(item)"
            >
              Yes, remove
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col style="color:red">
            {{ error }}
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    whatisDeleting: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      error: '',
      isLoading: false
    }
  },
  methods: {
    emitMyEvents(item) {
      this.$emit('delete', item)
      this.$emit('close')
    }
  }
}
</script>
