const { resolve } = require('path')
const r = path => resolve(__dirname, path)

require('babel-core/register')({
  'presets': [
    'stage-3',
    'latest-node'
  ],
  'plugins': [
    'transform-decorators-legacy',
    ['module-alias', [
      { 'src': r('./server'), 'expose': '~'},
      { 'src': r('./server/database'), 'expose': 'database'}
    ]]
  ]
})

require('babel-polyfill')

class Fuck{
  constructor(){}
  @readonly
  init(){
    console.log(123)
  }
}

function readonly(target, key, descriptor) {
  descriptor.writable = false
  return descriptor
}

new Fuck().init()

