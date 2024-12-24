<template>
  <div class="map-container">
    <div id="container" />
    <div id="route-panel" class="route-panel" />
    <!-- 路线信息显示面板 -->
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      map: null,
      marker: null, // 当前用户位置的标记
      nursingHomeMarker: null, // 养老院位置的标记
      drivingRoute: null, // 路线规划对象
      defaultPosition: [116.397428, 39.90923], // 默认位置
      zoomLevel: 13, // 地图缩放级别
      nursingHomePosition: [104.0658, 30.6631] // 养老院位置
    }
  },
  computed: {
    ...mapGetters(['avatar']) // 获取用户头像
  },
  mounted() {
    window._AMapSecurityConfig = {
      securityJsCode: '6b90dc0daf4d4507a683adb00b875b08'
    }

    // 加载高德地图
    AMapLoader.load({
      key: 'd1078fca035b68910cdedf4f4332cfee', // 申请好的Web端开发者Key
      version: '2.0', // 指定要加载的 JSAPI 的版本
      plugins: ['AMap.Scale', 'AMap.Driving'] // 添加驾车路线规划插件
    })
      .then(AMap => {
        this.map = new AMap.Map('container', {
          viewMode: '3D', // 是否为3D地图模式
          zoom: this.zoomLevel // 初始化地图级别
        })

        // 创建一个比例尺插件
        this.map.addControl(new AMap.Scale())

        // 获取当前地理位置
        this.getCurrentLocation(AMap)

        // 添加养老院位置标记
        this.addNursingHomeMarker(AMap)
      })
      .catch(e => this.handleError('地图加载失败，请稍后重试！', e))
  },
  methods: {
    getCurrentLocation(AMap) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => this.handlePositionSuccess(AMap, position),
          error => this.handlePositionError(AMap, error)
        )
      } else {
        this.$message({
          showClose: true,
          message: '定位失败，请检查是否开启定位！',
          type: 'error'
        })
        this.createMarker(AMap, this.defaultPosition)
        this.addRoute(AMap, this.defaultPosition)
      }
    },

    handlePositionSuccess(AMap, position) {
      const { latitude, longitude } = position.coords

      // 设置地图中心点为当前位置
      this.map.setCenter([longitude, latitude])

      // 创建一个新的标记
      this.createMarker(AMap, [longitude, latitude])

      // 调整地图缩放级别
      this.adjustZoomLevel(AMap, [longitude, latitude])

      // 定位成功后规划路线
      this.addRoute(AMap, [longitude, latitude])
    },

    handlePositionError(AMap, error) {
      this.$message({
        showClose: true,
        message: '定位失败，请检查是否开启定位！',
        type: 'error'
      })
      this.createMarker(AMap, this.defaultPosition)
      this.addRoute(AMap, this.defaultPosition)
    },

    createMarker(AMap, position) {
      // 设置头像图标大小并且调整偏移量
      const icon = new AMap.Icon({
        image: this.avatar || 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        size: new AMap.Size(50, 50), // 设置头像图标的大小
        imageSize: new AMap.Size(50, 50) // 重新设置图标大小
      })

      if (this.marker) {
        this.marker.setMap(null) // 移除旧标记
      }

      this.marker = new AMap.Marker({
        position: position,
        icon: icon,
        offset: new AMap.Pixel(-25, -50) // 偏移量调整，确保标记完全可见
      })

      this.marker.setMap(this.map)
    },

    adjustZoomLevel(AMap, position) {
      const zoomLevel = this.calculateZoomLevel(position)
      this.map.setZoom(zoomLevel)
    },

    calculateZoomLevel(position) {
      return this.zoomLevel // 固定缩放级别
    },

    addNursingHomeMarker(AMap) {
      const nursingHomeIcon = new AMap.Icon({
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
        size: new AMap.Size(32, 32)
      })

      this.nursingHomeMarker = new AMap.Marker({
        position: this.nursingHomePosition,
        icon: nursingHomeIcon,
        offset: new AMap.Pixel(-16, -32)
      })

      const infoWindow = new AMap.InfoWindow({
        content:
          '<div><strong>悦年康居养老院</strong><br>四川省成都市成华大道二仙桥对面</div>',
        offset: new AMap.Pixel(0, -32)
      })

      this.nursingHomeMarker.on('click', () => {
        infoWindow.open(this.map, this.nursingHomePosition)
      })

      this.map.add(this.nursingHomeMarker)
    },

    addRoute(AMap, startPosition) {
      const driving = new AMap.Driving({
        map: this.map,
        panel: 'route-panel',
        autoClamped: true
      })

      driving.search(startPosition, this.nursingHomePosition, (status, result) => {
        if (status === 'complete') {
          this.$message({
            showClose: true,
            message: '路线规划成功！',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: '路线规划失败，请检查路线是否可达！',
            type: 'error'
          })
        }
      })
    },

    handleError(message, error) {
      console.error(error)
      this.$message({
        showClose: true,
        message: message,
        type: 'error'
      })
    }
  }
}
</script>

<style>
.map-container {
  display: flex;
  flex-direction: column;
  height: 89.7vh;
}

#container {
  flex: 1;
  font-family: "楷体";
}

.route-panel {
  max-height: 20vh;
  flex-shrink: 0;
  overflow-y: scroll;
  background-color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 10;
}
</style>
