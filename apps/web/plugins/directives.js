import Vue from 'vue'

const dict = {}

Vue.directive('test', {
  /**
   * @param {HTMLElement} el
   * @param {{
   *  name: string,
   *  value: string,
   *  oldValue: string,
   *  expression: string,
   *  arg: string,
   *  modifiers: string
   * }} binding
   */
  bind(el, binding) {
    if (dict[binding.name] === undefined) {
      dict[binding.name] = {}
    }
    // Test if the useragent contains "tests" or if environment is development
    if (
      window.navigator.userAgent.includes('tests') ||
      process.env.NODE_ENV === 'development'
    ) {
      el.setAttribute('data-test', binding.value.toLowerCase())
      if (
        binding.value.toLowerCase() in dict[binding.name] &&
        document.querySelector(`[data-test="${binding.value.toLowerCase()}"]`)
      ) {
        console.error(
          '[Vue]',
          'Duplicate test name:',
          binding.value.toLowerCase()
        )
        return
      }
      dict[binding.name][binding.value.toLowerCase()] = el
    }
  }
})
