import { ref, watchEffect } from 'vue';
console.log(ref);

let count = ref(0);

watchEffect(() => {
    console.log('count', count.value)
})
count.value++;