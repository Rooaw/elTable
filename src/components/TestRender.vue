
<script lang="tsx">
import { h, ref, reactive  } from 'vue'

export default {

    setup() {
        const readersNumber = ref(0)
        const book = reactive({ title: 'Vue 3 Guide' })
        // 请注意这里我们需要显式使用 ref 的 value
        // return () => h('div', [readersNumber.value, book.title])
        return () => (
            <div> test {book.title}</div>
        )
    }
}

</script>