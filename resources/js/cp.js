import TailwindColorPicker from './TailwindColorPicker.vue'

console.log('tailwind-fieldtype cp.js loaded')

Statamic.booting(() => {
    console.log('registering tailwind_picker-fieldtype')
    Statamic.$components.register('tailwind_picker-fieldtype', TailwindColorPicker)
})