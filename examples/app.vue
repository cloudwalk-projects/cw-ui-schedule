<template lang="html">
<div class="example-page">
  <h2>代码示例</h2>

  <div style="padding:10px;">
    <cw-schedule :rows="dataRows" begin-date="2017-12-12" end-date="2017-12-12" :begin-hour="9" :end-hour="18" show-outside-border></cw-schedule>
  </div>

  <div style="padding:10px;">
    <cw-schedule :rows="dataRows" begin-date="2017-12-10" end-date="2017-12-15" :begin-hour="9" :end-hour="12" show-outside-border></cw-schedule>
  </div>

  <div style="padding:10px;">
    <cw-schedule :rows="dataRows" begin-date="2017-12-10" end-date="2018-03-05" :begin-hour="9" :end-hour="12" show-outside-border></cw-schedule>
  </div>

  <div style="padding:10px;">
    <div ref="ganttChart" :rows="dataRows"></div>
  </div>

  <h2>API</h2>
    <h5>Treetable props</h5>
    <table class="api-define-table" style="width:100%">
      <thead>
        <tr>
          <td>属性</td>
          <td>说明</td>
          <td>类型</td>
          <td>默认值</td>
        </tr>
      </thead>
      <tbody>
      <tr>
        <td>columns</td>
        <td>表格列数据信息</td>
        <td>object[]</td>
        <td>-</td>
      </tr>
      <tr>
        <td>rows</td>
        <td>表格行数据信息</td>
        <td>object[]</td>
        <td>-</td>
      </tr>
      <tr>
        <td>display</td>
        <td>显示方式<br/>可选的值 collapsed(折叠) | expand(展开)</td>
        <td>string</td>
        <td>expand</td>
      </tr>
      <tr>
        <td>borderless</td>
        <td>无边框形式</td>
        <td>boolean</td>
        <td>false</td>
      </tr>
      <tr>
        <td>caption</td>
        <td>表格名称</td>
        <td>boolean</td>
        <td>-</td>
      </tr>
      <tr>
        <td>selection</td>
        <td>显示复选框</td>
        <td>boolean</td>
        <td>false</td>
      </tr>
      <tr>
        <td>columnId</td>
        <td>唯一标识数据列</td>
        <td>number</td>
        <td>0</td>
      </tr>
      <tr>
        <td>columnParentId</td>
        <td>父级对象唯一标识数据列</td>
        <td>number</td>
        <td>1</td>
      </tr>
      <tr>
        <td>columnHandle</td>
        <td>树操作数据列</td>
        <td>number</td>
        <td>2</td>
      </tr>
      </tbody>
    </table>
    <h5>Treetable events</h5>
    <table class="api-define-table" style="width:100%">
      <thead>
        <tr>
          <td>事件名</td>
          <td>说明</td>
          <td>返回值</td>
        </tr>
      </thead>
      <tbody>
      <tr>
        <td>click</td>
        <td>表格行单击时触发, 在次单击同一行选中失效</td>
        <td>返回选中的行信息</td>
      </tr>
      <tr>
        <td>change</td>
        <td>表格复选框选择时触发</td>
        <td>复选框选中的行信息数组</td>
      </tr>
      </tbody>
    </table>
</div>
</template>

<script>
import gantt from '../src/components/schedule/gantt';

const dataRows = [
  {
    id: '0101',
    name: '重庆会议室 1-1',
    labelHtml: function(h, params) {
      return h('div', 'xxx<br />aabb');
    },
    content: 'aaaabccdddeee<br />ddddddd',
    contentHtml: function() {
      return 'xxx';
    },
    schedules: [{ from: '2017-12-12 10:00', to: '2017-12-12 11:30' , description:'aa'}]
  },
  {
    id: '0102',
    name: '重庆会议室 1-2',
    labelHtml: function(h, params) {
      return h('div', 'xxx<br />aabb');
    },
    content: 'aaaabccddddddddddddd',
    schedules: [{ from: '2017-12-17 09:00', to: '2017-12-17 09:30', description:'aa' }]
  },
  {
    id: '0203',
    name: '重庆会议室 2-3',
    labelHtml: function(h, params) {
      return h('div', 'xxx<br />aabb');
    },
    content: 'aaaabccdddbbbbbbbbbbbbbbbb',
    schedules: [{ from: '2017-12-12 09:00', to: '2017-12-12 10:30', description:'aa' }, { from: '2017-12-20 10:00', to: '2017-12-20 11:30', description:'aa' }]
  },
  {
    id: '0204',
    name: '重庆会议室 2-4',
    labelHtml: function(h, params) {
      return h('div', 'xxx<br />aabb');
    },
    content: 'aaaabccdddbbbbbbbbbbbbbbbb',
    schedules: [{ from: '2017-12-12 09:00', to: '2017-12-12 10:30', description:'aa' }, { from: '2017-12-20 10:00', to: '2017-12-20 11:30', description:'abc' }]
  }
];

export default {
  data() {
    return {
      dataRows
    };
  },
  mounted() {
    var ganttObj = gantt.newGantt(this.$refs.ganttChart);

    ganttObj.addTask(gantt.newTask('2009-11-11', '2009-11-19', '<b>任务1</b>', '阮郁', 50));
    ganttObj.addTask(gantt.newTask('2009-11-16', '2009-11-19', '- Sample task 1.1', '孙啸,吉其亮', 30));
    ganttObj.addTask(gantt.newTask('2009-11-16', '2009-11-19', '- Sample task 1.1', '孙啸,吉其亮', 30));
    ganttObj.addTask(gantt.newTask('2009-11-16', '2009-11-19', '--- Sample task 1.1', '孙啸,吉其亮', 30));
    ganttObj.addTask(gantt.newTask('2009-11-12', '2009-12-02', 'Sample task 2', 'Hanhnd', 60));
    ganttObj.addTask(gantt.newTask('2009-11-11', '2009-11-16', '<i>Sample task 3<i>', 'Dathq', 50));
    ganttObj.addTask(gantt.newTask('2009-11-11', '2009-11-19', '<b>Sample task 1 1</b>', 'Dathq', 50));
    ganttObj.addTask(gantt.newTask('2009-11-16', '2009-11-19', '... Sample task 1.1', 'Dathq, Thanhdo', 30));
    ganttObj.addTask(gantt.newTask('2009-11-12', '2009-12-02', 'Sample task 2', 'Hanhnd', 60));
    ganttObj.addTask(gantt.newTask('2009-11-11', '2009-11-16', '<i>Sample task 3<i>', 'Dathq', 50));
    ganttObj.addTask(gantt.newTask('2009-11-11', '2009-11-19', '<b>Sample task 1 1</b>', 'Dathq', 50));
    ganttObj.addTask(gantt.newTask('2009-11-16', '2009-11-19', '... Sample task 1.1', 'Dathq, Thanhdo', 30));
    ganttObj.addTask(gantt.newTask('2009-11-12', '2009-12-02', 'Sample task 2', 'Hanhnd', 60));
    ganttObj.addTask(gantt.newTask('2009-11-11', '2009-11-16', '<i>Sample task 3<i>', 'Dathq', 50));

    ganttObj.addTask(gantt.newTask('2009-11-11', '2009-11-19', '<b>Sample task 1 1</b>', 'Dathq', 50));
    ganttObj.addTask(gantt.newTask('2009-11-16', '2009-11-19', '... Sample task 1.1', 'Dathq, Thanhdo', 30));
    ganttObj.addTask(gantt.newTask('2009-11-12', '2009-12-02', 'Sample task 2', 'Hanhnd', 60));

    // gantt.addTask(gantt.newTask('2010-03-11', '2010-03-16', '<i>Sample task 3<i>', 'Dathq', 50));

    ganttObj.draw();
  },
  methods: {}
};
</script>

<style>
.cw-gantt {
  border-collapse: collapse;
}

.cw-gantt td {
  border: 1px solid #ccc;
}

.cw-gantt-task {
  border: 1px solid #ccc;
}

.cw-gantt-table {
}

.cw-gantt-month {
  border: 1px solid #ccc;
}

.cw-gantt-day {
  border: 1px solid #ccc;
}

.cw-gantt-wrapper {
  font-size: 14px;
  position: relative;
}
.cw-gantt-wrapper div {
}

.cw-gantt-wrapper table {
  border-collapse: collapse;
  background-color: #fff;
  border: 1px solid #ccc;
}
.cw-gantt-wrapper table td {
  border: 1px solid #ccc;
}
.cw-gantt-wrapper table td div {
  line-height: 100%;
}

.cw-gantt-task-title {
  font-weight: bold;
  height: 200%;
  width: 200px;
  padding: 4px;
}

.cw-gantt-month {
  padding-left: 5px;
  font-weight: bold;
}

.cw-gantt-today {
  background-color: #fdfde0;
}

.cw-gantt-weekend {
  font-family: tahoma, arial, verdana;
  background-color: #f5f5f5;
  text-align: center;
}

.cw-gantt-day {
  font-family: tahoma, arial, verdana;
  text-align: center;
}

.cw-gantt-task {
  border-top: 1px solid #cacaca;
  border-bottom: 1px solid #cacaca;
  height: 14px;
  background-color: #aaa8cb;
}
.cw-gantt-task-resource {
  margin: -3px 0 0 4px;
  font-size: 14px;
}

.cw-gantt-task-text {
  font-size: 14px;
}

.cw-gantt-progress {
  background-color: #fff;
  height: 2px;
  overflow: hidden;
  margin-top: 6px;
}
</style>
