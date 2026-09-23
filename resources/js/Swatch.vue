<template>
    <div
        @click="update"
        class="h-8 w-8 rounded-md border m-1 cursor-pointer"
        :class="isActive ? 'ring-2' : ''"
        :style="{ backgroundColor: color.hex }"
        :title="title"
    >
        <span class="sr-only">{{ title }}</span>
    </div>
</template>

<script>
export default {
    props: {
        color: {
            type: Object,
            required: true,
        },
        active: {
            type: Object,
            required: true,
        },
    },

    emits: ['select'],

    computed: {
        isActive() {
            return this.active.color === this.color.color && this.active.weight === this.color.weight;
        },
        title() {
            if (this.color.weight === null) {
                return this.color.color;
            }

            return `${this.color.color}-${this.color.weight}`;
        },
    },

    methods: {
        update() {
            this.$emit('select', {
                color: this.color.color,
                weight: this.color.weight,
            });
        },
    },
};
</script>