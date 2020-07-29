import { ref, watchEffect } from 'vue';

let count = ref(0);

watchEffect(() => {
    console.log('count', count.value)
})
const timer = setInterval(() => {
    count.value++;
    if (count.value === 10) {
        clearInterval(timer)
    }
}, 1000)
