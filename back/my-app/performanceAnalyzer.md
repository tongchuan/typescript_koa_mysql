# 前端代码性能监控完整方案

前端性能监控是保证用户体验的关键环节。下面从数据采集、上报、分析到优化的完整方案。

## 一、性能数据采集

### 1. **Web Vitals 核心指标监控**

```javascript
// web-vitals.js - Google 官方库
import {getCLS, getFID, getLCP, getFCP, getTTFB} from 'web-vitals';

// 监控所有核心指标
function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);  // 累积布局偏移
    getFID(onPerfEntry);  // 首次输入延迟
    getLCP(onPerfEntry);  // 最大内容绘制
    getFCP(onPerfEntry);  // 首次内容绘制
    getTTFB(onPerfEntry); // 首字节时间
  }
}

// 自定义上报
getCLS(metric => {
  console.log('CLS:', metric.value);
  reportToAnalytics(metric);
});
```

### 2. **Performance API 全面监控**

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }

  init() {
    // 监控资源加载性能
    this.monitorResources();
    
    // 监控页面性能
    this.monitorNavigation();
    
    // 监控用户交互
    this.monitorUserTiming();
    
    // 监控长任务
    this.monitorLongTasks();
    
    // 监控内存
    this.monitorMemory();
  }

  // 1. 资源加载监控
  monitorResources() {
    if (performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource');
      
      resources.forEach(resource => {
        this.metrics[resource.name] = {
          duration: resource.duration,
          transferSize: resource.transferSize,
          initiatorType: resource.initiatorType,
          startTime: resource.startTime,
          redirectTime: resource.redirectEnd - resource.redirectStart,
          dnsTime: resource.domainLookupEnd - resource.domainLookupStart,
          tcpTime: resource.connectEnd - resource.connectStart,
          ttfb: resource.responseStart - resource.requestStart,
          responseTime: resource.responseEnd - resource.responseStart,
        };
      });
    }
  }

  // 2. 页面导航监控
  monitorNavigation() {
    if (performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0];
      
      if (navigation) {
        this.metrics.navigation = {
          // 关键时间点
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          ssl: navigation.secureConnectionStart > 0 
            ? navigation.connectEnd - navigation.secureConnectionStart 
            : 0,
          ttfb: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
          load: navigation.loadEventEnd - navigation.startTime,
          
          // 其他指标
          redirectCount: navigation.redirectCount,
          redirectTime: navigation.redirectEnd - navigation.redirectStart,
          domInteractive: navigation.domInteractive,
        };
      }
    }
  }

  // 3. 自定义用户指标
  monitorUserTiming() {
    // 标记关键业务时间点
    performance.mark('app-initialized');
    
    // 测量关键流程
    performance.measure('app-startup', 'navigationStart', 'app-initialized');
    
    // 获取测量结果
    const measures = performance.getEntriesByType('measure');
    measures.forEach(measure => {
      this.metrics[measure.name] = measure.duration;
    });
  }

  // 4. 长任务监控
  monitorLongTasks() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver(list => {
        list.getEntries().forEach(entry => {
          console.warn('长任务:', entry.duration);
          this.reportLongTask(entry);
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  // 5. 内存监控
  monitorMemory() {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        this.metrics.memory = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        };
      }, 60000);
    }
  }
}
```

### 3. **React 应用性能监控**

```javascript
// React Profiler API
import React, { Profiler } from 'react';

function onRenderCallback(
  id, // 发生提交的 Profiler 树的 "id"
  phase, // "mount"（如果组件树刚加载） 或者 "update"（如果它重渲染了）之一
  actualDuration, // 本次更新 committed 花费的渲染时间
  baseDuration, // 估计不使用 memoization 的情况下渲染整颗子树需要的时间
  startTime, // 本次更新中 React 开始渲染的时间
  commitTime, // 本次更新中 React committed 的时间
  interactions // 属于本次更新的 interactions 的集合
) {
  // 汇总或记录渲染时间
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  });
}

// 使用示例
<Profiler id="App" onRender={onRenderCallback}>
  <App />
</Profiler>
```

### 4. **错误监控**

```javascript
class ErrorMonitor {
  constructor() {
    this.init();
  }

  init() {
    // JavaScript 错误
    window.addEventListener('error', this.handleError.bind(this), true);
    
    // Promise 错误
    window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
    
    // 资源加载错误
    window.addEventListener('error', this.handleResourceError.bind(this), true);
    
    // 跨域脚本错误
    window.addEventListener('messageerror', this.handleMessageError.bind(this));
    
    // 控制台错误
    this.interceptConsole();
  }

  handleError(event) {
    const errorData = {
      type: 'js_error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
    
    this.reportError(errorData);
    return false;
  }

  handlePromiseError(event) {
    const errorData = {
      type: 'promise_error',
      reason: event.reason?.toString(),
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
    };
    
    this.reportError(errorData);
  }

  interceptConsole() {
    const originalError = console.error;
    console.error = (...args) => {
      this.reportError({
        type: 'console_error',
        messages: args,
        timestamp: new Date().toISOString(),
      });
      originalError.apply(console, args);
    };
  }
}
```

### 5. **用户行为监控**

```javascript
class UserBehaviorMonitor {
  constructor() {
    this.session = {
      startTime: Date.now(),
      pageviews: [],
      clicks: [],
      routes: [],
    };
    this.init();
  }

  init() {
    // 页面访问
    this.trackPageView();
    
    // 点击事件
    this.trackClicks();
    
    // 路由变化
    this.trackRouting();
    
    // 滚动深度
    this.trackScrollDepth();
    
    // 停留时间
    this.trackTimeOnPage();
  }

  trackPageView() {
    const pageview = {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: Date.now(),
      pageTitle: document.title,
    };
    
    this.session.pageviews.push(pageview);
    this.report('pageview', pageview);
  }

  trackClicks() {
    document.addEventListener('click', event => {
      const target = event.target;
      const clickData = {
        selector: this.getSelector(target),
        text: target.textContent?.slice(0, 100),
        tagName: target.tagName,
        id: target.id,
        className: target.className,
        href: target.href,
        timestamp: Date.now(),
        pageX: event.pageX,
        pageY: event.pageY,
      };
      
      this.session.clicks.push(clickData);
      this.report('click', clickData);
    }, { capture: true });
  }

  trackRouting() {
    // History API
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
    };
    
    window.addEventListener('locationchange', () => {
      this.trackPageView();
    });
  }

  trackScrollDepth() {
    let maxScroll = 0;
    
    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = document.documentElement.scrollTop;
      const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      
      const thresholds = [25, 50, 75, 100];
      thresholds.forEach(threshold => {
        if (percentage >= threshold && maxScroll < threshold) {
          this.report('scroll_depth', {
            percentage: threshold,
            timestamp: Date.now(),
          });
          maxScroll = threshold;
        }
      });
    });
  }

  getSelector(element) {
    const parts = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      
      if (element.id) {
        selector += `#${element.id}`;
        parts.unshift(selector);
        break;
      } else {
        let sibling = element;
        let siblingIndex = 1;
        while (sibling = sibling.previousElementSibling) {
          siblingIndex++;
        }
        if (siblingIndex !== 1) {
          selector += `:nth-child(${siblingIndex})`;
        }
      }
      parts.unshift(selector);
      element = element.parentNode;
    }
    return parts.join(' > ');
  }
}
```

## 二、数据上报优化

### 1. **高性能上报器**

```javascript
class PerformanceReporter {
  constructor(config = {}) {
    this.config = {
      endpoint: config.endpoint || '/api/performance',
      sampleRate: config.sampleRate || 1.0,
      batchSize: config.batchSize || 10,
      delay: config.delay || 5000,
      ...config,
    };
    
    this.queue = [];
    this.isSending = false;
    this.init();
  }

  init() {
    // 页面卸载时发送剩余数据
    window.addEventListener('beforeunload', () => {
      if ('sendBeacon' in navigator) {
        const data = JSON.stringify(this.queue);
        navigator.sendBeacon(this.config.endpoint, data);
      } else {
        this.flush();
      }
    });

    // 定时发送
    setInterval(() => this.flush(), this.config.delay);
    
    // 批量发送
    if (this.config.batchSize) {
      this.setupBatchSending();
    }
  }

  report(data, type = 'performance') {
    // 采样率控制
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    const payload = {
      type,
      data,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
    };

    this.queue.push(payload);

    // 达到批量大小立即发送
    if (this.config.batchSize && this.queue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  async flush() {
    if (this.isSending || this.queue.length === 0) {
      return;
    }

    this.isSending = true;
    const dataToSend = [...this.queue];
    this.queue = [];

    try {
      if ('sendBeacon' in navigator) {
        const blob = new Blob([JSON.stringify(dataToSend)], {
          type: 'application/json',
        });
        navigator.sendBeacon(this.config.endpoint, blob);
      } else {
        // 降级方案
        await this.sendByFetch(dataToSend);
      }
    } catch (error) {
      console.error('上报失败:', error);
      // 失败重试
      this.queue.unshift(...dataToSend);
    } finally {
      this.isSending = false;
    }
  }

  async sendByFetch(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        keepalive: true, // 保持连接
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('perf_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('perf_session_id', sessionId);
    }
    return sessionId;
  }
}
```

### 2. **Web Worker 上报**

```javascript
// worker.js
self.onmessage = function(event) {
  const { type, data } = event.data;
  
  switch (type) {
    case 'REPORT':
      processReport(data);
      break;
    case 'FLUSH':
      flushQueue();
      break;
  }
};

let queue = [];

function processReport(data) {
  queue.push(data);
  
  // 达到阈值或超时发送
  if (queue.length >= 10) {
    flushQueue();
  }
}

async function flushQueue() {
  if (queue.length === 0) return;
  
  const dataToSend = [...queue];
  queue = [];
  
  try {
    await fetch('https://your-api.com/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
      mode: 'cors',
    });
  } catch (error) {
    // 失败重试
    queue.unshift(...dataToSend);
  }
}

// 主线程使用
const worker = new Worker('worker.js');

function reportViaWorker(data) {
  worker.postMessage({
    type: 'REPORT',
    data: {
      ...data,
      timestamp: Date.now(),
    },
  });
}
```

## 三、性能分析和可视化

### 1. **性能指标计算**

```javascript
class PerformanceAnalyzer {
  static analyze(metrics) {
    return {
      // 核心指标
      core: {
        lcp: this.calculateLCP(metrics.lcp),
        fid: this.calculateFID(metrics.fid),
        cls: this.calculateCLS(metrics.cls),
        fcp: metrics.fcp,
        ttfb: metrics.ttfb,
      },
      
      // 加载性能
      loading: {
        domReady: metrics.domContentLoaded,
        pageLoad: metrics.load,
        resources: this.analyzeResources(metrics.resources),
      },
      
      // 稳定性
      stability: {
        longTasks: metrics.longTasks?.length || 0,
        memoryLeak: this.checkMemoryLeak(metrics.memory),
        errorCount: metrics.errors?.length || 0,
      },
      
      // 用户体验
      ux: {
        timeToInteractive: this.calculateTTI(metrics),
        firstMeaningfulPaint: this.calculateFMP(metrics),
        speedIndex: this.calculateSpeedIndex(metrics),
      },
    };
  }

  static calculateLCP(lcpEntries) {
    if (!lcpEntries || lcpEntries.length === 0) return null;
    
    const lcp = lcpEntries[lcpEntries.length - 1];
    return {
      value: lcp.startTime,
      element: lcp.element?.tagName,
      url: lcp.url,
      size: lcp.size,
      rating: this.getRating(lcp.startTime, [2500, 4000]), // 2.5s内优秀，4s内良好
    };
  }

  static calculateTTI(metrics) {
    // 使用 Long Tasks API 计算可交互时间
    const longTasks = metrics.longTasks || [];
    let lastLongTaskEnd = 0;
    
    longTasks.forEach(task => {
      if (task.startTime + task.duration > lastLongTaskEnd) {
        lastLongTaskEnd = task.startTime + task.duration;
      }
    });
    
    return lastLongTaskEnd || metrics.domContentLoaded;
  }

  static analyzeResources(resources) {
    const analysis = {
      total: resources.length,
      byType: {},
      slowResources: [],
      largeResources: [],
    };
    
    resources.forEach(resource => {
      // 按类型统计
      analysis.byType[resource.initiatorType] = 
        (analysis.byType[resource.initiatorType] || 0) + 1;
      
      // 慢资源（>2秒）
      if (resource.duration > 2000) {
        analysis.slowResources.push({
          name: resource.name,
          duration: resource.duration,
          type: resource.initiatorType,
        });
      }
      
      // 大资源（>500KB）
      if (resource.transferSize > 500 * 1024) {
        analysis.largeResources.push({
          name: resource.name,
          size: resource.transferSize,
          type: resource.initiatorType,
        });
      }
    });
    
    return analysis;
  }

  static getRating(value, thresholds) {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  }
}
```

### 2. **数据存储结构设计**

```javascript
// 数据库表结构示例
const performanceSchema = {
  // 会话信息
  session_id: String,
  user_id: String,
  
  // 环境信息
  user_agent: String,
  browser: String,
  browser_version: String,
  os: String,
  device_type: String,
  screen_resolution: String,
  connection_type: String,
  
  // 页面信息
  page_url: String,
  page_title: String,
  referrer: String,
  
  // 性能指标
  navigation_timing: Object,
  resource_timing: Array,
  web_vitals: {
    lcp: Number,
    fid: Number,
    cls: Number,
    fcp: Number,
    ttfb: Number,
  },
  
  // 业务指标
  time_to_interactive: Number,
  first_meaningful_paint: Number,
  
  // 自定义指标
  custom_metrics: Object,
  
  // 错误信息
  errors: Array,
  
  // 时间戳
  created_at: Date,
};
```

## 四、实时性能监控面板

### 1. **Dashboard 组件**

```javascript
// PerformanceDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const PerformanceDashboard = () => {
  const [metrics, setMetrics] = useState({
    realtime: [],
    historical: [],
    alerts: [],
    summary: {},
  });

  // WebSocket 连接实时数据
  useEffect(() => {
    const ws = new WebSocket('wss://your-api.com/performance-ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMetrics(prev => ({
        ...prev,
        realtime: [...prev.realtime.slice(-50), data], // 保留最近50条
      }));
    };
    
    return () => ws.close();
  }, []);

  // 获取历史数据
  useEffect(() => {
    fetch('/api/performance/history')
      .then(res => res.json())
      .then(data => setMetrics(prev => ({ ...prev, historical: data })));
  }, []);

  return (
    <div className="performance-dashboard">
      <div className="summary-cards">
        <MetricCard
          title="LCP"
          value={metrics.summary.lcp}
          threshold={2500}
          unit="ms"
        />
        <MetricCard
          title="FID"
          value={metrics.summary.fid}
          threshold={100}
          unit="ms"
        />
        <MetricCard
          title="CLS"
          value={metrics.summary.cls}
          threshold={0.1}
          unit=""
        />
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.historical}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="lcp" stroke="#8884d8" />
            <Line type="monotone" dataKey="fcp" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metrics.resourceAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
            <Bar dataKey="totalSize" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <AlertPanel alerts={metrics.alerts} />
    </div>
  );
};
```

## 五、性能告警系统

```javascript
class PerformanceAlert {
  constructor(config) {
    this.thresholds = {
      lcp: { warning: 2500, critical: 4000 },
      fid: { warning: 100, critical: 300 },
      cls: { warning: 0.1, critical: 0.25 },
      errorRate: { warning: 0.01, critical: 0.05 },
      memory: { warning: 0.7, critical: 0.9 }, // 内存使用率
    };
    
    this.alertHistory = [];
    this.init();
  }

  init() {
    // 监控异常指标
    this.setupMonitoring();
    
    // 定时检查
    setInterval(() => this.checkMetrics(), 60000);
  }

  checkMetric(metric, value) {
    const threshold = this.thresholds[metric];
    if (!threshold) return;
    
    if (value >= threshold.critical) {
      this.sendAlert(metric, 'critical', value);
    } else if (value >= threshold.warning) {
      this.sendAlert(metric, 'warning', value);
    }
  }

  sendAlert(metric, level, value) {
    const alert = {
      id: Date.now(),
      metric,
      level,
      value,
      timestamp: new Date(),
      pageUrl: window.location.href,
      userCount: this.getActiveUsers(),
    };
    
    // 避免重复告警
    if (!this.isDuplicateAlert(alert)) {
      this.alertHistory.push(alert);
      
      // 发送告警
      this.notify(alert);
      
      // 上报
      this.reportAlert(alert);
    }
  }

  notify(alert) {
    // 控制台警告
    console.warn(`[性能告警] ${alert.metric}: ${alert.value} (${alert.level})`);
    
    // 页面通知（仅开发环境）
    if (process.env.NODE_ENV === 'development') {
      this.showNotification(alert);
    }
    
    // Webhook 通知
    if (this.config.webhook) {
      this.sendWebhook(alert);
    }
  }

  showNotification(alert) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('性能告警', {
        body: `${alert.metric} 超过阈值: ${alert.value}`,
        icon: '/warning-icon.png',
      });
    }
  }

  sendWebhook(alert) {
    fetch(this.config.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    });
  }

  isDuplicateAlert(newAlert) {
    const recentAlerts = this.alertHistory.filter(
      alert => Date.now() - alert.timestamp < 5 * 60 * 1000
    );
    
    return recentAlerts.some(
      alert => 
        alert.metric === newAlert.metric && 
        alert.level === newAlert.level
    );
  }
}
```

## 六、性能优化建议生成

```javascript
class PerformanceOptimizer {
  static generateRecommendations(metrics) {
    const recommendations = [];
    
    // LCP 优化建议
    if (metrics.lcp > 2500) {
      recommendations.push({
        type: 'lcp',
        priority: 'high',
        suggestions: [
          '优化 Largest Contentful Paint 元素',
          '预加载关键资源',
          '移除渲染阻塞资源',
          '使用 CDN 加速',
        ],
        resources: [
          'https://web.dev/optimize-lcp/',
          'https://developers.google.com/web/tools/lighthouse/audits/largest-contentful-paint',
        ],
      });
    }
    
    // CLS 优化建议
    if (metrics.cls > 0.1) {
      recommendations.push({
        type: 'cls',
        priority: 'high',
        suggestions: [
          '为图片和视频设置尺寸属性',
          '预留广告位空间',
          '避免动态插入内容',
          '使用 transform 代替 top/left',
        ],
      });
    }
    
    // 资源优化建议
    const resourceAnalysis = PerformanceAnalyzer.analyzeResources(metrics.resources);
    
    if (resourceAnalysis.slowResources.length > 0) {
      recommendations.push({
        type: 'slow_resources',
        priority: 'medium',
        resources: resourceAnalysis.slowResources,
        suggestions: [
          '启用资源压缩',
          '使用懒加载',
          '实现资源预加载',
          '优化图片格式',
        ],
      });
    }
    
    // 内存优化建议
    if (metrics.memory?.usedJSHeapSize > metrics.memory?.jsHeapSizeLimit * 0.8) {
      recommendations.push({
        type: 'memory',
        priority: 'high',
        suggestions: [
          '检查内存泄漏',
          '及时清理事件监听器',
          '使用 WeakMap/WeakSet',
          '避免闭包滥用',
        ],
      });
    }
    
    return this.prioritizeRecommendations(recommendations);
  }
  
  static prioritizeRecommendations(recommendations) {
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }
}
```

## 七、部署和集成

### 1. **封装为 npm 包**

```json
{
  "name": "@company/frontend-monitor",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w"
  },
  "dependencies": {
    "web-vitals": "^3.0.0"
  }
}
```

### 2. **Webpack 插件自动注入**

```javascript
// webpack-monitor-plugin.js
class WebpackMonitorPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('WebpackMonitorPlugin', stats => {
      const { assets, chunks } = stats.toJson();
      
      // 生成构建报告
      const report = {
        buildTime: Date.now(),
        assets: this.analyzeAssets(assets),
        chunks: this.analyzeChunks(chunks),
        bundleSize: this.calculateBundleSize(assets),
      };
      
      // 发送报告
      this.sendReport(report);
    });
  }
  
  analyzeAssets(assets) {
    return assets.map(asset => ({
      name: asset.name,
      size: asset.size,
      chunks: asset.chunks,
      emitted: asset.emitted,
    }));
  }
}
```

## 八、最佳实践总结

1. **多维度监控**：结合业务指标和技术指标
2. **实时性**：重要指标实时上报和告警
3. **采样控制**：合理设置采样率，平衡数据量和性能
4. **错误处理**：监控系统自身要健壮
5. **隐私保护**：避免收集敏感信息，遵守 GDPR
6. **性能影响**：监控系统自身要轻量，不影响业务性能
7. **可视化**：数据要直观展示，便于分析
8. **自动化**：集成到 CI/CD，自动生成报告

通过这套完整的监控方案，可以实现从前端数据采集、处理、上报到分析、告警的全链路性能监控，帮助团队快速发现和解决性能问题。