const generateWithPlugin = require('@vue/cli-test-utils/generateWithPlugin')

test('mpvue', async () => {
  const { pkg } = await generateWithPlugin({
    id: 'mpvue',
    apply: require('../generator'),
    options: {}
  })

  expect(pkg.scripts.mpvue).toBeTruthy()
})
