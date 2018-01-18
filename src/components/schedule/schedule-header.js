// 表格栏信息
export default {
  name: 'ScheduleHeader',
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number
  },
  render: (h, ctx) => {
    const params = {
      row: ctx.props.row,
      index: ctx.props.index
    };

    return ctx.props.render(h, params);
  }
};
