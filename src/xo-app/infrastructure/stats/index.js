import _ from 'intl'
import ActionButton from 'action-button'
import cloneDeep from 'lodash/cloneDeep'
import Component from 'base-component'
import forEach from 'lodash/forEach'
import Icon from 'icon'
import map from 'lodash/map'
import propTypes from 'prop-types-decorator'
import React from 'react'
import renderXoItem from 'render-xo-item'
import sortBy from 'lodash/sortBy'
import Upgrade from 'xoa-upgrade'
import XoWeekCharts from 'xo-week-charts'
import XoWeekHeatmap from 'xo-week-heatmap'
import { Container, Row, Col } from 'grid'
import { error } from 'notification'
import { SelectHostVm } from 'select-objects'
import { createGetObjectsOfType } from 'selectors'
import { connectStore, formatSize, mapPlus } from 'utils'
import { fetchHostStats, fetchVmStats } from 'xo'

// ===================================================================

const computeMetricArray = (
  stats,
  { metricKey, metrics, objectId, timestampStart, valueRenderer }
) => {
  if (!stats) {
    return
  }

  if (!metrics[metricKey]) {
    metrics[metricKey] = {
      key: metricKey,
      renderer: valueRenderer,
<<<<<<< Updated upstream
      values: {}, // Stats of all object for one metric.
=======
      values: {} // Stats of all object for one metric.
>>>>>>> Stashed changes
    }
  }

  // Stats of one object.
  metrics[metricKey].values[objectId] = map(stats, (value, i) => ({
    value: +value,
<<<<<<< Updated upstream
    date: timestampStart + 3600000 * i,
=======
    date: timestampStart + 3600000 * i
>>>>>>> Stashed changes
  }))
}

// ===================================================================

const computeCpusMetric = (cpus, { objectId, ...params }) => {
  forEach(cpus, (cpu, index) => {
    computeMetricArray(cpu, {
      metricKey: `CPU ${index}`,
      objectId,
<<<<<<< Updated upstream
      ...params,
=======
      ...params
>>>>>>> Stashed changes
    })
  })

  const nCpus = cpus.length

  if (!nCpus) {
    return
  }

  const { metrics } = params
  const cpusAvg = cloneDeep(metrics['CPU 0'].values[objectId])

  for (let i = 1; i < nCpus; i++) {
    forEach(metrics[`CPU ${i}`].values[objectId], (value, index) => {
      cpusAvg[index].value += value.value
    })
  }

  forEach(cpusAvg, value => {
    value.value /= nCpus
  })

  const allCpusKey = 'All CPUs'

  if (!metrics[allCpusKey]) {
    metrics[allCpusKey] = {
      key: allCpusKey,
<<<<<<< Updated upstream
      values: {},
=======
      values: {}
>>>>>>> Stashed changes
    }
  }

  metrics[allCpusKey].values[objectId] = cpusAvg
}

const computeVifsMetric = (vifs, params) => {
  forEach(vifs, (vifs, vifsType) => {
    const rw = vifsType === 'rx' ? 'out' : 'in'

    forEach(vifs, (vif, index) => {
      computeMetricArray(vif, {
        metricKey: `Network ${index} ${rw}`,
        valueRenderer: formatSize,
<<<<<<< Updated upstream
        ...params,
=======
        ...params
>>>>>>> Stashed changes
      })
    })
  })
}

const computePifsMetric = (pifs, params) => {
  forEach(pifs, (pifs, pifsType) => {
    const rw = pifsType === 'rx' ? 'out' : 'in'

    forEach(pifs, (pif, index) => {
      computeMetricArray(pif, {
        metricKey: `NIC ${index} ${rw}`,
        valueRenderer: formatSize,
<<<<<<< Updated upstream
        ...params,
=======
        ...params
>>>>>>> Stashed changes
      })
    })
  })
}

const computeXvdsMetric = (xvds, params) => {
  forEach(xvds, (xvds, xvdsType) => {
    const rw = xvdsType === 'r' ? 'read' : 'write'

    forEach(xvds, (xvd, index) => {
      computeMetricArray(xvd, {
        metricKey: `Disk ${index} ${rw}`,
        valueRenderer: formatSize,
<<<<<<< Updated upstream
        ...params,
=======
        ...params
>>>>>>> Stashed changes
      })
    })
  })
}

const computeLoadMetric = (load, params) => {
  computeMetricArray(load, {
    metricKey: 'Load',
<<<<<<< Updated upstream
    ...params,
=======
    ...params
>>>>>>> Stashed changes
  })
}

const computeMemoryUsedMetric = (memoryUsed, params) => {
  computeMetricArray(memoryUsed, {
    metricKey: 'RAM used',
    valueRenderer: formatSize,
<<<<<<< Updated upstream
    ...params,
=======
    ...params
>>>>>>> Stashed changes
  })
}

// ===================================================================

const METRICS_LOADING = 1
const METRICS_LOADED = 2

const runningObjectsPredicate = object => object.power_state === 'Running'

const STATS_TYPE_TO_COMPUTE_FNC = {
  cpus: computeCpusMetric,
  vifs: computeVifsMetric,
  pifs: computePifsMetric,
  xvds: computeXvdsMetric,
  load: computeLoadMetric,
<<<<<<< Updated upstream
  memoryUsed: computeMemoryUsedMetric,
}

@propTypes({
  onChange: propTypes.func.isRequired,
=======
  memoryUsed: computeMemoryUsedMetric
}

@propTypes({
  onChange: propTypes.func.isRequired
>>>>>>> Stashed changes
})
@connectStore(() => {
  const getRunningHosts = createGetObjectsOfType('host')
    .filter([runningObjectsPredicate])
    .sort()
  const getRunningVms = createGetObjectsOfType('VM')
    .filter([runningObjectsPredicate])
    .sort()

  return {
    hosts: getRunningHosts,
<<<<<<< Updated upstream
    vms: getRunningVms,
  }
})
class SelectMetric extends Component {
  constructor (props) {
    super(props)
    this.state = {
      objects: [],
      predicate: runningObjectsPredicate,
=======
    vms: getRunningVms
  }
})
class SelectMetric extends Component {
  constructor(props) {
    super(props)
    this.state = {
      objects: [],
      predicate: runningObjectsPredicate
>>>>>>> Stashed changes
    }
  }

  _handleSelection = objects => {
    this.setState({
      metricsState: undefined,
      metrics: undefined,
      objects,
      predicate: objects.length
        ? object =>
<<<<<<< Updated upstream
          runningObjectsPredicate(object) && object.type === objects[0].type
        : runningObjectsPredicate,
=======
            runningObjectsPredicate(object) && object.type === objects[0].type
        : runningObjectsPredicate
>>>>>>> Stashed changes
    })
  }

  _resetSelection = () => {
    this._handleSelection([])
  }

  _selectAllHosts = () => {
    this.setState({
      metricsState: undefined,
      metrics: undefined,
      objects: this.props.hosts,
      predicate: object =>
<<<<<<< Updated upstream
        runningObjectsPredicate(object) && object.type === 'host',
=======
        runningObjectsPredicate(object) && object.type === 'host'
>>>>>>> Stashed changes
    })
  }

  _selectAllVms = () => {
    this.setState({
      metricsState: undefined,
      metrics: undefined,
      objects: this.props.vms,
      predicate: object =>
<<<<<<< Updated upstream
        runningObjectsPredicate(object) && object.type === 'VM',
=======
        runningObjectsPredicate(object) && object.type === 'VM'
>>>>>>> Stashed changes
    })
  }

  _validSelection = async () => {
    this.setState({ metricsState: METRICS_LOADING })

    const { objects } = this.state
    const getStats =
      (objects[0].type === 'host' && fetchHostStats) || fetchVmStats

    const metrics = {}

    await Promise.all(
      map(objects, object => {
        return getStats(object, 'hours')
          .then(result => {
            const { stats } = result

            if (stats === undefined) {
              throw new Error('No stats')
            }

            const params = {
              metrics,
              objectId: object.id,
              timestampStart:
<<<<<<< Updated upstream
                (result.endTimestamp - 3600 * (stats.memory.length - 1)) * 1000,
=======
                (result.endTimestamp - 3600 * (stats.memory.length - 1)) * 1000
>>>>>>> Stashed changes
            }

            forEach(stats, (stats, type) => {
              const fnc = STATS_TYPE_TO_COMPUTE_FNC[type]

              if (fnc) {
                fnc(stats, params)
              }
            })
          })
          .catch(() => {
            error(
              _('statsDashboardGenericErrorTitle'),
              <span>
                {_('statsDashboardGenericErrorMessage')}{' '}
                {object.name_label || object.id}
              </span>
            )
          })
      })
    )

    this.setState({
      metricsState: METRICS_LOADED,
<<<<<<< Updated upstream
      metrics: sortBy(metrics, metric => metric.key),
=======
      metrics: sortBy(metrics, metric => metric.key)
>>>>>>> Stashed changes
    })
  }

  _handleSelectedMetric = event => {
    const { value } = event.target
    const { state } = this

    this.props.onChange(value !== '' && state.metrics[value], state.objects)
  }

<<<<<<< Updated upstream
  render () {
=======
  render() {
>>>>>>> Stashed changes
    const { metricsState, metrics, objects, predicate } = this.state

    return (
      <Container>
        <Row>
          <Col mediumSize={6}>
<<<<<<< Updated upstream
            <div className='form-group'>
=======
            <div className="form-group">
>>>>>>> Stashed changes
              <SelectHostVm
                multi
                onChange={this._handleSelection}
                predicate={predicate}
                value={objects}
              />
            </div>
<<<<<<< Updated upstream
            <div className='btn-group mt-1' role='group'>
              <ActionButton
                handler={this._resetSelection}
                icon='remove'
=======
            <div className="btn-group mt-1" role="group">
              <ActionButton
                handler={this._resetSelection}
                icon="remove"
>>>>>>> Stashed changes
                tooltip={_('dashboardStatsButtonRemoveAll')}
              />
              <ActionButton
                handler={this._selectAllHosts}
<<<<<<< Updated upstream
                icon='host'
=======
                icon="host"
>>>>>>> Stashed changes
                tooltip={_('dashboardStatsButtonAddAllHost')}
              />
              <ActionButton
                handler={this._selectAllVms}
<<<<<<< Updated upstream
                icon='vm'
=======
                icon="vm"
>>>>>>> Stashed changes
                tooltip={_('dashboardStatsButtonAddAllVM')}
              />
              <ActionButton
                disabled={!objects.length}
                handler={this._validSelection}
<<<<<<< Updated upstream
                icon='success'
=======
                icon="success"
>>>>>>> Stashed changes
              >
                {_('statsDashboardSelectObjects')}
              </ActionButton>
            </div>
          </Col>
          <Col mediumSize={6}>
            {metricsState === METRICS_LOADING ? (
              <div>
<<<<<<< Updated upstream
                <Icon icon='loading' /> {_('metricsLoading')}
=======
                <Icon icon="loading" /> {_('metricsLoading')}
>>>>>>> Stashed changes
              </div>
            ) : (
              metricsState === METRICS_LOADED && (
                <select
<<<<<<< Updated upstream
                  className='form-control'
                  onChange={this._handleSelectedMetric}
                >
                  {_('noSelectedMetric', message => (
                    <option value=''>{message}</option>
=======
                  className="form-control"
                  onChange={this._handleSelectedMetric}
                >
                  {_('noSelectedMetric', message => (
                    <option value="">{message}</option>
>>>>>>> Stashed changes
                  ))}
                  {map(metrics, (metric, key) => (
                    <option key={key} value={key}>
                      {metric.key}
                    </option>
                  ))}
                </select>
              )
            )}
          </Col>
        </Row>
      </Container>
    )
  }
}

// ===================================================================

@propTypes({
  metricRenderer: propTypes.func.isRequired,
<<<<<<< Updated upstream
  title: propTypes.any.isRequired,
=======
  title: propTypes.any.isRequired
>>>>>>> Stashed changes
})
class MetricViewer extends Component {
  _handleSelectedMetric = (selectedMetric, objects) => {
    this.setState({ selectedMetric, objects })
  }

<<<<<<< Updated upstream
  render () {
    const {
      props: { metricRenderer, title },
      state: { selectedMetric, objects },
=======
  render() {
    const {
      props: { metricRenderer, title },
      state: { selectedMetric, objects }
>>>>>>> Stashed changes
    } = this

    return (
      <div>
        <h3>{title}</h3>
        <SelectMetric onChange={this._handleSelectedMetric} />
        <hr />
        {selectedMetric && (
          <Container>
            <Row>
              <Col>
                {map(objects, object =>
                  renderXoItem(object, { className: 'mr-1' })
                )}
              </Col>
            </Row>
            <Row>
              <Col>{metricRenderer(selectedMetric)}</Col>
            </Row>
          </Container>
        )}
      </div>
    )
  }
}

// ===================================================================

const weekHeatmapRenderer = metric => (
  <div>
    <XoWeekHeatmap
      cellRenderer={metric.renderer}
      data={mapPlus(metric.values, (arr, push) => {
        forEach(arr, value => push(value))
      })}
    />
    <hr />
  </div>
)

const weekChartsRenderer = metric => (
  <XoWeekCharts
    series={map(metric.values, (data, id) => ({
      data,
<<<<<<< Updated upstream
      objectId: id,
=======
      objectId: id
>>>>>>> Stashed changes
    }))}
    valueRenderer={metric.renderer}
  />
)

const Stats = () =>
  process.env.XOA_PLAN > 2 ? (
    <div>
      <MetricViewer
        metricRenderer={weekHeatmapRenderer}
        title={_('weeklyHeatmap')}
      />
      <MetricViewer
        metricRenderer={weekChartsRenderer}
        title={_('weeklyCharts')}
      />
    </div>
  ) : (
    <Container>
<<<<<<< Updated upstream
      <Upgrade place='dashboardStats' available={3} />
=======
      <Upgrade place="dashboardStats" available={3} />
>>>>>>> Stashed changes
    </Container>
  )

export { Stats as default }