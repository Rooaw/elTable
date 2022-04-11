import { h, toRefs } from 'vue'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
export default {
  name: 'PaginationTable',
  props: {
    tableClass: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    hidePagination: {
      type: Boolean,
      default() {
        return false
      }
    },
    paginationEvents: {
      type: Object,
      default() {
        return {}
      }
    },
    tableEvents: {
      type: Object,
      default() {
        return {}
      }
    },
    pagination: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, { emit, attrs }) {
      console.log(attrs)
    const createTable = () => {
      return h(
        ElTable,
        {
          ref: 'table',
          data: props.tableData,
          ...attrs,
          class: props.tableClass,
          ...props.tableEvents
        },
        () =>
          props.columns.map((columnProps, $index) => {
            const key = columnProps.key || columnProps.prop || $index
            const emptyFormatter = (row, column, cellValue, index) => {
              return !cellValue && cellValue !== 0 ? '--' : cellValue
            }
            if (!Reflect.has(columnProps, 'formatter')) {
              columnProps.formatter = emptyFormatter
            }
            if (columnProps?.hide) {
              return null
            } else {
              return h(
                ElTableColumn,
                {
                  ...columnProps,
                  ...props.tableColumnEvents,
                  key
                },
                columnProps.render
              )
            }
          })
      )
    }
    const createPagination = () => {
      if (props.hidePagination || !props.pagination) return
      const { pagination } = toRefs(props)
      pagination.value['currentPage'] =
        pagination.value['current-page'] || pagination.value.pageNum || pagination.value.pageNo
      return h(
        'div',
        {
          class: 'mt-20',
          style: 'text-align:right;'
        },
        h(ElPagination, {
          small: false,
          background: true,
          layout: 'total, prev, pager, next',
          ...pagination.value,
          ...props.paginationEvents
        })
      )
    }
    // return {
    //   createTable,
    //   createPagination
    // }
    return () => { h('div', {}, [createTable(), createPagination()])}
  },
//   render() {
//     return h('div', {}, [this.createTable(), this.createPagination()])
//   }

}