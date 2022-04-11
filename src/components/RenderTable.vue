
<script>
export default {
  name: "Render-Table",
  props: {
    tableColumn: {
      type: Array,
    },
    tableData: {
      type: Array,
    },
    size: {
      type: String,
      default: "medium",
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    fit: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    headerCellStyle: {
      type: Function,
      default: (/*{ row, column, rowIndex, columnIndex }*/) => {
        return { color: "#000" };
      },
    },
    cellStyle: {
      type: Function,
      default: (/** {row, column, rowIndex, columnIndex}*/) => {
        return { color: "#333" };
      },
    },
    pagination: {
      type: Object,
      default: () => ({
        current: 1,
        size: 10,
        total: 0,
      }),
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
  },
  render(h) {
    const {
      tableData,
      size,
      stripe,
      border,
      fit,
      showHeader,
      headerCellStyle,
      cellStyle,
      sortChange,
      select,
      selectAll,
      selectionChange,
      tableColumn,
      // 分页
      pagination: { current, size: pageSize, total },
      pageSizes,
      sizeChange,
      currentChange,
    } = this;
    return h(
      "div",
      {
        class: {
          "render-table": true,
        },
      },
      [
        h(
          "el-table",
          {
            props: {
              data: tableData,
              size: size,
              stripe: stripe,
              border: border,
              fit: fit,
              "show-header": showHeader,
              "header-cell-style": headerCellStyle,
              "cell-style": cellStyle,
            },
            on: {
              "sort-change": sortChange,
              select: select,
              "select-all": selectAll,
              "selection-change": selectionChange,
            },
            style: {
              width: "100%",
            },
          },
          this.renderColumn(tableColumn, h)
        ),

        h("el-pagination", {
          props: {
            "current-page": current,
            "page-size": pageSize,
            "page-sizes": pageSizes,
            total: total,
            layout: "total, sizes, prev, pager, next, jumper",
          },
          on: {
            "size-change": sizeChange,
            "current-change": currentChange,
          },
          style: {
            "text-align": "right",
            "margin-top": "10px",
          },
        }),
      ]
    );
  },
  methods: {
    createColumn(column) {
      return [
        "el-table-column",
        {
          props: {
            ...this.attributesColumn(column),
          },
        },
      ];
    },
    createScopedSlot({ scopedSlots, prop }, h) {
      let { tag, text, textStyle, click, slot } = scopedSlots;
      let { isTrue, isFunc, columnClick, scopedSlotText } = this;
      return {
        scopedSlots: {
          default: (props) => {
            const value = props["row"][prop];
            if (slot) {
              return h(
                "div",
                this.$scopedSlots["opration"]({
                  row: props["row"],
                })
              );
            }
            return h(
              tag,
              {
                on: isTrue(click) ? { click: columnClick(props) } : {},
                style:
                  isFunc(textStyle) &&
                  textStyle(props["$index"] + 1, value, props["row"]),
              },
              scopedSlotText(text, value, props)
            );
          },
        },
      };
    },
    renderColumn(columns, h) {
      if (!columns || !columns.length) {
        return;
      }
      let tableColumn = [];
      columns.forEach((item) => {
        let { scopedSlots } = item;
        let column = this.createColumn(item);
        let vNode;
        if (this.notEmpty(scopedSlots)) {
          column[1] = {
            ...column[1],
            ...this.createScopedSlot(item, h),
          };
          vNode = h(...column);
        } else {
          vNode = h(...column, this.renderColumn(item.children, h));
        }
        tableColumn.push(vNode);
      });
      return tableColumn;
    },
    attributesColumn(column) {
      const attr = [
        "type",
        "label",
        "prop",
        "width",
        "align",
        "fixed",
        "sortable",
        "scopedSlots",
      ];
      let obj = {};
      attr.forEach((prop) => {
        column[prop] && (obj[prop] = column[prop]);
      });
      return obj;
    },
    notEmpty(obj) {
      if (typeof obj === "object" && JSON.stringify(obj) !== "{}") {
        return true;
      }
      return false;
    },
    isTrue(v) {
      return v === true;
    },
    isDef(v) {
      return v === undefined;
    },
    isFunc(v) {
      return typeof v === "function";
    },
    scopedSlotText(text, value, column) {
      const { $index: index, row } = column;
      if (!this.isDef(text)) {
        return this.isFunc(text) ? text(index, value, row) : text;
      }
      return value;

    },
    //自定义列点击
    columnClick(scope) {
      let { $index, row } = scope;
      return () => {
        this.$emit("columnClick", {
          index: $index,
          ...row,
        });
      };
    },
    //当表格的排序条件发生变化的时候会触发该事件
    sortChange({ order, prop }) {
      this.$emit("sortChange", { order, prop });
    },
    //当用户手动勾选数据行的 Checkbox 时触发的事件
    select(selection, row) {
      this.$emit("select", selection, row);
    },
    //当用户手动勾选全选 Checkbox 时触发的事件
    selectAll(selection) {
      this.$emit("select-all", selection);
    },
    //当选择项发生变化时会触发该事件
    selectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    //pageSize 改变时会触发
    sizeChange(size) {
      this.$emit("pagination-change", {
        current: this.pagination.current,
        size,
      });
    },

    //currentPage 改变时会触发
    currentChange(current) {
      this.$emit("pagination-change", {
        current,
        size: this.pagination.size,
      });
    },
  },

};
</script>
