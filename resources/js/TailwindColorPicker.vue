<template>
    <div class="text-sm">
        <div v-if="meta.missing_file" class="text-red-500">
            Tailwind config file not found. Did you run
            <code>php artisan krakero:tailwind-config</code>?
        </div>

        <popover :ref="'popper_' + id" :disabled="disabled" placement="bottom-start" :autoclose="autoclose"
            @opened="$emit('opened')" @closed="$emit('closed')">
            <template #trigger>
                <slot name="trigger">
                    <button v-if="selected && selected.color" v-tooltip="__('Switch Color')"
                        class="h-8 w-8 rounded-md border m-1" :style="{ backgroundColor: activeColorHex }" />
                    <button v-else v-tooltip="__('Pick Color')"
                        class="h-8 w-8 rounded-md border m-1 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6 text-gray-500">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </slot>
            </template>

            <template #default>
                <div class="px-4 py-2">
                    <div v-for="color in config.available_colors" :key="color" class="my-2">
                        <template v-if="mode === 'advanced'">
                            <div v-if="typeof colors[color] === 'string'" class="flex flex-wrap">
                                <swatch :color="{ color: color, weight: null, hex: colors[color] }" :active="selected"
                                    @select="setColor" />
                            </div>

                            <div v-else class="flex flex-wrap">
                                <swatch v-for="(hex, weight) in colors[color]" :key="`${hex}-${weight}`"
                                    :color="{ color, weight, hex }" :active="selected" @select="setColor" />
                            </div>
                        </template>

                        <template v-else>
                            <div class="flex flex-wrap">
                                <swatch v-if="colors[color][config.default_color] || color === 'transparent'"
                                    :color="{ color: color, weight: config.default_color, hex: colors[color][config.default_color] }"
                                    :active="selected" @select="setColor" />
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </popover>
    </div>
</template>

<script>
import { FieldtypeMixin as Fieldtype } from '@statamic/cms';
import Swatch from './Swatch.vue';

export default {
    mixins: [Fieldtype],

    components: {
        Swatch,
    },

    props: {
        value: {
            type: String,
            default: '',
        },
        config: {
            type: Object,
            default() {
                return {};
            },
        },
    },

    data() {
        return {
            isOpen: false,
            selected: {
                color: null,
                weight: null,
            },
            id: (Math.random() + 1).toString(36).substring(7),
        };
    },

    mounted() {
        if (this.value) {
            const parts = this.value.replace(this.config.class_prefix + '-', '').split('-');

            if (parts.length === 1) {
                this.selected.color = parts[0];
            }

            if (parts.length === 2) {
                this.selected.color = parts[0];
                this.selected.weight = parts[1];
            }

            if (parts.length === 3) {
                this.selected.color = parts[1];
                this.selected.weight = parts[2];
            }
        }
    },

    computed: {
        colors() {
            return this.meta.colors;
        },
        mode() {
            return this.config.mode;
        },
        activeColorHex() {
            if (!this.selected.color) return null;

            const color = this.colors[this.selected.color];

            if (typeof color === 'string') {
                return color;
            }

            return color[this.selected.weight ?? this.config.default_color];
        },
    },

    methods: {
        setColor({ color, weight = null }) {
            this.selected.color = color;
            this.selected.weight = weight;

            let className = '';

            if (this.config.class_prefix) {
                className = this.config.class_prefix + '-';
            }

            className += color;

            if (this.config.mode === 'simple') {
                weight = this.config.default_color;
            }

            if (weight) {
                className += '-' + weight;
            }

            this.update(className);

            const popover = this.$refs['popper_' + this.id];

            if (popover && typeof popover.close === 'function') {
                popover.close();
            }
        },
    },
};
</script>