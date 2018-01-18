<template>
  <div :data-nonce="nonce" :style="{border: (showOutsideBorder ? ('1px solid' + borderColor) : 'none')}">
    <table class="cw-schedule__layout" :style="{ height: height + 'px'}" >
      <tr>
        <td ref="left" class="cw-schedule__layout-left" >
          <div :style="{height: totalHeadHeight + 'px', lineHeight: totalHeadHeight + 'px', width: headDescriptionWidth + 'px', backgroundColor:'#fff', borderBottom: '1px solid #ccc', textAlign:'center'}" >{{headDescription}}</div>
          <div ref="layout-left" :style="{overflowY: 'hidden', height: height - totalHeadHeight + 'px'}" @scroll="handleLeftScroll">
          <table class="cw-schedule__left-table" >
          <tr v-for="(row, index) in rows" :key="index" >
            <td :style="{height: cellHeight + 'px'}">
              <schedule-header :index="index" :row="row" :render="row.labelHtml"></schedule-header>
            </td>
          </tr>
          </table>
          </div>
        </td>
        <td ref="right" class="cw-schedule__layout-right" >
          <div ref="layout-top" :style="{overflow: 'hidden'}" >
            <template v-if="headStyle=='day-time'">
            <table :class="classes" style="background-color:#fff;margin-right:40px">
              <tr>
                <th v-for="(day, index) in days" :key="index" v-text="day.fullLabel" class="cw-schedule-day" :colspan="timespanCount" :style="{ height:headHeight + 'px', padding:0}" ></th>
              </tr>
              <tr>
                <template v-for="day in days">
                  <template v-for="(time, index) in times" >
                    <th :key="index" class="cw-schedule-day" :style="{ height:headHeight + 'px', padding:0, width:cellWidth + 'px'}" ><div :style="{width:cellWidth + 'px', borderBottom:'none', padding:0}" >{{time.label}}</div></th>
                  </template>
                </template>
              </tr>
            </table>
            </template>
            <template v-else>
            <table :class="classes" style="background-color:#fff">
              <tr>
                <th v-for="(month, index) in months" :key="index" v-text="month.label" class="cw-schedule-month" :colspan="month.days * timespanCount" :style="{ height:headHeight + 'px', padding:0}" ></th>
              </tr>
              <tr>
                <th v-for="(day, index) in days" :key="index" v-text="day.label" class="cw-schedule-day" :colspan="timespanCount" :style="{ height:headHeight + 'px', padding:0}" ></th>
              </tr>
              <tr>
                <template v-for="day in days">
                  <template v-for="(time, index) in times" >
                    <th :key="index" class="cw-schedule-day" :style="{ height:headHeight + 'px', padding:0, width:cellWidth + 'px'}" ><div :style="{width:cellWidth + 'px', borderBottom:'none'}" >{{time.label}}</div></th>
                  </template>
                </template>
              </tr>
            </table>
            </template>
          </div>
          <div :style="{position: 'relative', overflow: 'hidden', height: height - totalHeadHeight + 'px'}">
          <div ref="layout-right" :style="{overflowY: 'auto', height: height - totalHeadHeight + 'px'}" @scroll.passive="handleRightScroll" @mouseup="handleMouseUp" @mousedown="handleMouseDown" >
            <table class="cw-schedule-content" >
              <tr v-for="(row, index) in rows" :key="index" >
                <template v-for="(day, indexX) in days">
                  <td v-for="(time, indexY) in times" :key="indexX + '-'+ indexY" :style="{ height:cellHeight + 'px', width:cellWidth + 'px'}" @click="handleCellClick" @mouseup="handleCellMouseUp" @mousedown="handleCellMouseDown" @mousemove="handleCellMouseMove" >
                    <div :id=" 'C_' + row.id + '_' + day.code + '_' + time.code " class="schedule-background" :style="{ width:cellWidth + 'px'}"></div>
                  </td>
                </template>
              </tr>
            </table>
          </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import x from 'x-lib';
import ScheduleHeader from './schedule-header';
import utils from './utils';

const logger = '[schedule]';
const prefixCls = 'cw-schedule';

const props = {
  // 计划安排的开始时间
  beginDate: {
    type: String,
    default: ''
  },
  // 计划安排的结束时间
  endDate: {
    type: String,
    default: ''
  },
  // 计划安排的开始时间
  beginHour: {
    type: Number,
    default: 9
  },
  // 计划安排的结束小时
  endHour: {
    type: Number,
    default: 18
  },
  // 半小时
  halfHour: {
    type: Boolean,
    default: true
  },
  // 高度
  height: {
    type: Number,
    default: 300
  },
  borderColor: {
    type: String,
    default: '#ccc'
  },
  showOutsideBorder: {
    type: Boolean,
    default: false
  },
  // 头部单元格高度
  headHeight: {
    type: Number,
    default: 20
  },
  // 头部显示样式, 可选值 month-day-time | day-time
  headStyle: {
    type: String,
    default: 'day-time'
  },
  // 头部描述
  headDescription: {
    type: String,
    default: ''
  },
  // 头部描述宽度
  headDescriptionWidth: {
    type: Number,
    default: 200
  },
  // 活动的背景颜色, 表示已被占用的时间段
  activeColor: {
    type: String,
    default: '#ebeffa'
  },
  // 高亮的背景颜色, 表示被选中的时间段
  hightlightColor: {
    type: String,
    default: '#fdf5ed'
  },
  // 单元格高度
  cellHeight: {
    type: Number,
    default: 100
  },
  // 单元格宽度
  cellWidth: {
    type: Number,
    default: 40
  },
  // 启用点击选择
  enableClickSelected: {
    type: Boolean,
    default: false
  },
  // 滚动的偏移量, 可以控制滚动的数据
  scrollOffset: {
    type: Number,
    default: 20
  },
  // 滚动条宽度
  scrollbarWidth: {
    type: Number,
    default: 17
  },
  // 数据记录
  rows: {
    type: Array,
    default: undefined
  }
};

export default {
  name: 'Schedule',
  components: {
    ScheduleHeader
  },

  props: props,
  data() {
    return {
      nonce: 0,
      // 月份信息
      months: [],
      // 月份信息
      days: [],
      // 月份信息
      times: [],
      // 开始日期
      begin: null,
      // 结束日期
      end: null,
      // 时间跨度统计
      timespanCount: 1,
      // 鼠标滚动
      enableWheel: true,
      // 鼠标选中日期
      enableMouseSelecteDateRange: false
    };
  },
  mounted() {
    console.log(logger + ' mounted.');
    this.renderDays(this.beginDate, this.endDate);
    this.renderContent();

    x.on(window, 'resize', () => {
      console.log(logger + ' window.resize.');
      this.nonce = x.nonce();
      this.renderDays(this.beginDate, this.endDate);
      this.renderContent();
    });
  },
  updated() {
    console.log(logger + ' updated.');
    this.renderContent();
  },
  computed: {
    columnKey() {
      return this.columns[this.columnId].key;
    },
    columnParentKey() {
      return this.columns[this.columnParentId].key;
    },
    classes() {
      return [
        `${prefixCls}`,
        {
          [`borderless`]: this.borderless
        }
      ];
    },
    totalHeadHeight() {
      if (this.headStyle == 'day-time') {
        return this.headHeight * 2 + 1;
      } else {
        return this.headHeight * 3 + 2;
      }
    }
  },
  methods: {
    handleLeftScroll(evt) {
      // console.log(evt.target.scrollTop);
      this.$refs['layout-right'].scrollTop = evt.target.scrollTop;
    },
    handleRightScroll(evt) {
      // console.log(this);
      // console.log(evt);
      // console.log(evt.target.scrollLeft);
      // console.log(evt.target.scrollTop);
      // 处理鼠标滚动的
      let top = this.$refs['layout-left'].scrollTop;
      let scrollDirect = '';
      let scrollOffset = 0;

      if (this.enableWheel) {
        if (top > evt.target.scrollTop) {
          scrollDirect = 'up';
          scrollOffset = -this.scrollOffset;
          // console.log('up:top' + top + ', scrollTop:' + evt.target.scrollTop);
        } else if (top < evt.target.scrollTop) {
          scrollDirect = 'down';
          scrollOffset = this.scrollOffset;
          // console.log('down:top' + top + ', scrollTop:' + evt.target.scrollTop);
        } else {
          scrollDirect = '';
          scrollOffset = 0;
        }
      }

      // console.log('scrollLeft:' + this.$refs['layout-top'].scrollLeft);
      // console.log('scrollLeft:' + evt.target.scrollLeft);
      // console.log(evt.target.scrollWidth - evt.target.scrollLeft - evt.target.offsetWidth);

      console.log('scrollTop:' + this.$refs['layout-left'].scrollTop);
      console.log('scrollTop:' + evt.target.scrollTop);
      console.log(evt.target.scrollHeight - evt.target.scrollTop - evt.target.offsetHeight);

      if (evt.target.scrollHeight - (evt.target.scrollTop + evt.target.offsetHeight) >= -(this.scrollbarWidth - 1) / 2) {
        this.$refs['layout-left'].scrollTop = evt.target.scrollTop + scrollOffset;
      } else {
        evt.target.scrollTop = evt.target.scrollTop - this.scrollbarWidth / 2;
      }

      if (evt.target.scrollWidth - (evt.target.scrollLeft + evt.target.offsetWidth) >= -(this.scrollbarWidth - 1) / 2) {
        this.$refs['layout-top'].scrollLeft = evt.target.scrollLeft;
      } else {
        evt.target.scrollLeft = evt.target.scrollLeft - this.scrollbarWidth / 2;
      }

      let scrollLeft = evt.target.scrollLeft;
      let list = this.$el.querySelectorAll('.schedule-content');

      for (let i = 0; i < list.length; i++) {
        list[i].style.zIndex = -1;
        // list[i].style.top = this.getElementTop(list[i].parentNode) - evt.target.scrollTop + 41 + 'px';
        // list[i].style.left = this.getElementLeft(list[i].parentNode) - evt.target.scrollLeft + 2 + 'px';
        list[i].style.top = list[i].parentNode.offsetTop - evt.target.scrollTop + 1 + 'px';
        list[i].style.left = list[i].parentNode.offsetLeft - evt.target.scrollLeft + 4 + 'px';
      }

      // console.log(list);
    },
    // 鼠标
    handleMouseDown(evt) {
      this.enableWheel = false;
      console.log('mouse down');
    },
    // 鼠标按键弹起
    handleMouseUp(evt) {
      this.enableWheel = true;
      console.log('mouse up');
    },
    // 处理水平滚动
    handleHorizontalScroll(evt) {
      this.$refs['layout-right'].scrollLeft = evt.target.scrollLeft;
    },
    // 鼠标
    handleCellMouseUp(evt) {
      this.enableMouseSelecteDateRange = false;
    },
    //
    handleCellMouseDown(evt) {
      this.enableMouseSelecteDateRange = true;
    },
    //
    handleCellMouseMove(evt) {
      if (this.enableClickSelected) {
        let element = evt.target;

        if (element.dataset['active'] == 1) {
          return;
        }

        if (this.enableMouseSelecteDateRange) {
          let hightlightColor = this.hightlightColor;

          if (hightlightColor.indexOf('#') > -1) {
            hightlightColor = x.color.rgb(hightlightColor);
          }

          evt.target.style.backgroundColor = this.hightlightColor;
        }
      }
    },
    //
    handleCellClick(evt) {
      if (this.enableClickSelected) {
        let element = evt.target;

        if (element.dataset['active'] == 1) {
          return;
        }

        let hightlightColor = this.hightlightColor;

        if (hightlightColor.indexOf('#') > -1) {
          hightlightColor = x.color.rgb(hightlightColor);
        }

        console.log(hightlightColor);

        if (element.style.backgroundColor == hightlightColor) {
          evt.target.style.backgroundColor = 'transparent';
        } else {
          evt.target.style.backgroundColor = this.hightlightColor;
        }
      }
    },
    // 获取选择的单元格信息
    getSelectedCells() {
      let cells = [];

      let hightlightColor = this.hightlightColor;

      if (hightlightColor.indexOf('#') > -1) {
        hightlightColor = x.color.rgb(hightlightColor);
      }

      let list = this.$el.querySelectorAll('.schedule-background');

      for (let i = 0; i < list.length; i++) {
        if (list[i].parentNode.style.backgroundColor == hightlightColor) {
          cells.push(list[i].id);
        }
      }

      return cells;
    },
    getElementTop(element) {
      let top = element.offsetTop;
      if (element.offsetParent) {
        top += this.getElementTop(element.offsetParent);
      }
      return top;
    },

    getElementLeft(element) {
      let left = element.offsetLeft;
      if (element.offsetParent) {
        left += this.getElementLeft(element.offsetParent);
      }
      return left;
    },

    /**
     *
     */
    renderDays(beginDate, endDate) {
      console.log('begin-date:' + beginDate + ', end-date:' + endDate);

      // 清理会议安排的内容
      let list = this.$el.querySelectorAll('.schedule-background');

      for (let i = 0; i < list.length; i++) {
        if (list[i].parentNode.style.borderRight == 'none') {
          list[i].parentNode.style.borderRight = '1px solid' + this.borderColor;
        }
        list[i].style.backgroundColor = 'transparent';
        // list[i].style.width = this.cellWidth - 2 + 'px';
        list[i].style.borderLeft = '';
        // list[i].style.width = this.cellWidth - 1 + 'px';
        list[i].parentNode.title = '';
        list[i].parentNode.style.backgroundColor = 'transparent';
        list[i].parentNode.dataset['active'] = 0;
        list[i].parentNode.style.borderLeft = list[i].parentNode.style.borderRight = '';
      }

      list = this.$el.querySelectorAll('.schedule-content');

      for (let i = 0; i < list.length; i++) {
        list[i].parentNode.removeChild(list[i]);
      }

      // 月份信息
      this.months = [];
      // 月份信息
      this.days = [];
      // 月份信息
      this.times = [];
      this.begin = x.date.create(beginDate);
      this.end = x.date.create(endDate);

      this.timespanCount = (this.endHour - this.beginHour) * (this.halfHour ? 2 : 1);

      var monthCount = this.begin.diff('month', this.end);

      // console.log(monthCount);

      // 构建月份信息
      for (let i = 0; i <= monthCount; i++) {
        let month = this.begin.month + i + 1;
        let year = this.begin.year + Math.floor((month - 1) / 12);

        month = month % 12;

        if (month == 0) {
          month = 12;
        }

        let days = utils.getDaysInMonth(year, month);

        // 同一个月份的天数
        if (this.begin.year == this.end.year && this.begin.month == this.end.month) {
          days = this.end.day - this.begin.day + 1;
        } else if (this.begin.year == year && this.begin.month + 1 == month) {
          days = days - this.begin.day + 1;
        } else if (this.end.year == year && this.end.month + 1 == month) {
          days = this.end.day;
        }

        this.months.push({
          year: year,
          month: month,
          label: x.paddingZero(month, 2),
          fullLabel: year + '-' + x.paddingZero(month, 2),
          days: days
        });
      }

      // console.log(this.months);

      // 构建天数信息
      for (let i = 0; i < this.months.length; i++) {
        let days = utils.getDaysInMonth(this.months[i].year, this.months[i].month);

        let j = 1;

        if (i == 0) {
          j = this.begin.day;
          // 处理同一个月之内的
          if (i == this.months.length - 1) {
            days = j + this.months[i].days - 1;
          }
        } else if (i == this.months.length - 1) {
          days = this.months[i].days;
        }

        // console.log('days:' + i);
        // console.log(j);
        // console.log(this.months[i].days);

        for (; j <= days; j++) {
          this.days.push({
            code: this.months[i].year + '_' + x.paddingZero(this.months[i].month, 2) + '_' + x.paddingZero(j, 2),
            label: x.paddingZero(j, 2),
            fullLabel: this.months[i].year + '-' + x.paddingZero(this.months[i].month, 2) + '-' + x.paddingZero(j, 2)
          });
        }
      }

      // console.log(this.days);

      for (let i = this.beginHour; i < this.endHour; i++) {
        this.times.push({
          code: x.paddingZero(i, 2) + '_00',
          label: x.paddingZero(i, 2) + ':00'
        });
        this.times.push({
          code: x.paddingZero(i, 2) + '_30',
          label: x.paddingZero(i, 2) + ':30'
        });
      }

      // this.$refs.right.offsetWidth
      let height = this.$refs.right.offsetHeight - (this.headHeight * 3 + 2) + 'px';
      this.$refs.left.children[1].style.height = height - 30 + 'px';

      this.$refs.right.children[0].style.width = this.$refs.right.offsetWidth - 10 + 'px';

      this.$refs.right.children[1].style.width = this.$refs.right.offsetWidth - 1 + 'px';
      this.$refs.right.children[1].style.height = height + 'px';
      // this.$refs.right.children[0].children[0].style.height = this.$refs.right.offsetHeight - 22 + 'px';
      console.log(logger + ' generate days.');
    },

    /**
     * 生成内容
     */
    renderContent() {
      for (let i = 0; i < this.rows.length; i++) {
        for (let j = 0; j < this.rows[i].schedules.length; j++) {
          // 会议安排信息
          let item = this.rows[i].schedules[j];

          let fromValue = this.rows[i].schedules[j].from.replace(/[-| |:]/g, '_');
          let toValue = this.rows[i].schedules[j].to.replace(/[-| |:]/g, '_');
          let code = 'C_' + this.rows[i].id + '_' + fromValue;
          // console.log(code);
          // 父级元素
          let parent = null;
          // 当前元素
          let el = this.$el.querySelector('#' + code);

          if (el) {
            parent = el.parentNode;
            if (parent.cellIndex == 0) {
              parent.style.borderLeft = 'none';
            } else {
              parent.style.borderLeft = '1px solid ' + this.borderColor;
            }
            if (parent.cellIndex == parent.parentNode.childNodes.length - 1) {
              parent.style.borderRight = '1px solid ' + this.borderColor;
            } else {
              parent.style.borderRight = 'none';
            }
            parent.dataset['active'] = 1;
            // el.parentNode.style.backgroundColor = this.activeColor;

            el.title = item.title;
            el.style.backgroundColor = this.activeColor;
            el.style.width = this.cellWidth - 6 + 'px';
            el.style.height = this.cellHeight + 'px';
            el.style.position = 'relative';
            el.style.zIndex = -2;
            el.style.borderLeft = '4px solid #86a2d1';
            // el.style.margin = '0px -1px 0 -1px';
          }

          let values = fromValue;
          // 单元格数量
          let cellCount = 1;

          let loopCount = 0;

          while (values != toValue) {
            let keys = values.split('_');

            if (keys[keys.length - 1] == '30') {
              keys[keys.length - 1] = '00';
              keys[keys.length - 2] = Number(keys[keys.length - 2]) + 1;
            } else {
              keys[keys.length - 1] = '30';
            }

            values = keys.join('_');
            // console.log(values);

            if (values == toValue || loopCount > 100) {
              // console.log(loopCount);
              break;
            }

            let code = 'C_' + this.rows[i].id + '_' + values;
            // console.log(code);

            let el = this.$el.querySelector('#' + code);

            if (el) {
              // 设置左边为
              el.parentNode.style.borderLeft = 'none';
              if (el.parentNode.cellIndex == el.parentNode.parentNode.childNodes.length - 1) {
                el.parentNode.style.borderRight = '1px solid ' + this.borderColor;
              } else {
                el.parentNode.style.borderRight = 'none';
              }
              el.parentNode.dataset['active'] = 1;

              el.parentNode.title = item.title;
              el.title = item.title;
              el.style.backgroundColor = this.activeColor;
              el.style.width = this.cellWidth + 'px';
              // el.style.width = '';
              el.style.height = this.cellHeight + 'px';
              el.style.position = 'relative';
              el.style.zIndex = -2;
              // el.style.margin = '0px -1px 0 -1px';

              cellCount++;
            }

            loopCount++;
          }

          if (parent) {
            parent.title = item.title;

            let content = parent.childNodes.length == 2 ? parent.childNodes[1] : document.createElement('div');

            // let left = 10;
            let left = this.getElementLeft(parent);
            let top = this.getElementTop(parent);
            content.className = 'schedule-content';
            content.dataset['x'] = left;
            content.dataset['y'] = top;
            // content.style.width = '31px';
            // content.style.height = '0px';
            // content.style.position = 'relative';
            content.style.position = 'absolute';
            content.style.backgroundColor = this.activeColor;
            content.style.height = this.cellHeight + 'px';
            content.style.top = parent.offsetTop - this.$refs['layout-right'].scrollTop + 1 + 'px';
            content.style.left = parent.offsetLeft - this.$refs['layout-right'].scrollLeft + 4 + 'px';
            content.style.zIndex = -1;
            // content.style.margin = '-100px -24px 0 0px';

            // content.title = item.title;
            // content.style.left = left + 'px';

            let html = '<div style="width:' + (this.cellWidth * cellCount - 10) + 'px; overflow:hidden" >' + item.description + '</div>';

            content.innerHTML = html;

            parent.appendChild(content);
          }
        }
      }

      // <div :key="indexY" >{{row.name}} # {{schedule.from}} - {{schedule.to}}</div>
      console.log(logger + ' render content.');
    }
  }
};
</script>

<style scoped>
.cw-schedule__layout {
  width: 100%;
  border-collapse: collapse;
}
.cw-schedule__layout td {
  border: 0px solid #ccc;
  padding: 0;
}
.cw-schedule__layout-left,
.cw-schedule__layout-right {
  vertical-align: top;
}
.cw-schedule__layout-left {
  width: 200px;
  border-right: 1px solid #ccc !important;
}
.cw-schedule__left-table {
  width: 100%;
  border-collapse: collapse;
  border: none;
  background: #fff;
}
.cw-schedule__left-table th {
  height: 60px;
}
.cw-schedule__left-table td {
  border: none;
  font-size: 12px;
  border-top: 1px solid #ccc;
  height: 32px;
  padding: 0 10px 0 10px;
}
.cw-schedule__left-table td:last-child {
  border-bottom: 1px solid #ccc;
}
.cw-schedule,
.cw-schedule-content {
  border-collapse: collapse;
}
.cw-schedule th {
  height: 18px;
  font-size: 12px;
  font-weight: normal;
}
.cw-schedule th,
.cw-schedule td,
.cw-schedule-content td {
  border: 1px solid #ccc;
}
.cw-schedule th:first-child,
.cw-schedule td:first-child,
.cw-schedule-content td:first-child {
  border-left: none;
}
.cw-schedule-content td:first-child {
  border-right: none;
}
.cw-schedule tr:first-child > th {
  border-top: none;
}
.cw-schedule td {
  height: 32px;
  vertical-align: top;
}
</style>
