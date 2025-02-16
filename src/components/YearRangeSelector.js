import RangeSelector, {
  Chart,
  CommonSeriesSettings, Format, Label,
  Margin,
  Scale,
  SeriesTemplate
} from 'devextreme-react/range-selector'

export const YearRangeSelector = (props) => {
  return (
    <RangeSelector
      id="range-selector"
      // title="Select a Year Period"
      onValueChanged={props.onValueChanged}
      theme={'generic.dark'}
      dataSource={props.dataSource}
      className="_range-selector-container"
    >
      <Margin top={25}/>
      <Chart>
        <CommonSeriesSettings
          argumentField="year"
          valueField="year"
          type="spline"
        />
        <SeriesTemplate nameField="state" />
      </Chart>
      <Scale>
        <Label>
          <Format type="decimal"/>
        </Label>
      </Scale>
    </RangeSelector>
  )
};
