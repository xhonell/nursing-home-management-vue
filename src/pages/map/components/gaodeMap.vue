<template>
  <div class="map-container">
    <div id="container">这是地图接口</div>
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
      drivingRoute: null // 路线规划对象
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
          zoom: 11 // 初始化地图级别
        })

        // 创建一个比例尺插件
        this.map.addControl(new AMap.Scale())

        // 获取当前地理位置
        this.getCurrentLocation(AMap)

        // 添加养老院位置标记
        this.addNursingHomeMarker(AMap)
      })
      .catch(e => {
        console.error(e)
      })
  },
  methods: {
    getCurrentLocation(AMap) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords

            // 设置地图中心点为当前位置
            this.map.setCenter([longitude, latitude])

            // 创建一个新的标记
            if (this.marker) {
              // 如果已经有标记，先移除它
              this.marker.setMap(null)
            }

            // 设置头像图标大小并且调整偏移量
            const wristbandIcon = new AMap.Icon({
              image: this.avatar,
              size: new AMap.Size(50, 50), // 设置头像图标的大小
              imageSize: new AMap.Size(50, 50) // 重新设置图标大小
            })

            this.marker = new AMap.Marker({
              position: [longitude, latitude],
              icon: wristbandIcon,
              offset: new AMap.Pixel(-25, -50) // 偏移量调整，确保标记完全可见
            })

            // 添加标记到地图
            this.marker.setMap(this.map)

            // 调整地图缩放级别，使头像完整显示
            this.adjustZoomLevel(AMap, [longitude, latitude])

            // 调用路线规划
            this.addRoute(AMap, [longitude, latitude])
          },
          error => {
            console.error('定位失败: ', error)
            // 定位失败后使用默认位置
            this.map.setCenter([116.397428, 39.90923])

            // 创建一个默认位置的标记
            if (this.marker) {
              this.marker.setMap(null)
            }

            const wristbandIcon = new AMap.Icon({
              image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
              size: new AMap.Size(50, 50) // 设置默认图标的大小
            })

            this.marker = new AMap.Marker({
              position: [116.397428, 39.90923],
              icon: wristbandIcon,
              offset: new AMap.Pixel(-25, -50)
            })

            // 添加标记到地图
            this.marker.setMap(this.map)
          }
        )
      } else {
        console.error('浏览器不支持定位功能')
        // 如果浏览器不支持定位，使用默认位置
        this.map.setCenter([116.397428, 39.90923])

        // 创建一个默认位置的标记
        if (this.marker) {
          this.marker.setMap(null)
        }

        const wristbandIcon = new AMap.Icon({
          image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          size: new AMap.Size(50, 50) // 设置默认图标的大小
        })

        this.marker = new AMap.Marker({
          position: [116.397428, 39.90923],
          icon: wristbandIcon,
          offset: new AMap.Pixel(-25, -50)
        })

        // 添加标记到地图
        this.marker.setMap(this.map)
      }
    },

    adjustZoomLevel(AMap, position) {
      // 计算并调整地图的缩放级别
      const zoomLevel = this.calculateZoomLevel(position)
      this.map.setZoom(zoomLevel) // 动态调整缩放级别
    },

    calculateZoomLevel(position) {
      // 你可以根据需要调整这个方法来计算缩放级别
      // 这里只是一个示例，假设我们根据位置调整缩放级别
      const zoomLevel = 13 // 设置一个合适的缩放级别
      return zoomLevel
    },

    addNursingHomeMarker(AMap) {
      // 养老院的坐标
      const nursingHomePosition = [104.0658, 30.6631]

      // 创建养老院图标
      const nursingHomeIcon = new AMap.Icon({
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png', // 假设有一个专门的养老院图标
        size: new AMap.Size(32, 32)
      })

      // 创建养老院标记
      this.nursingHomeMarker = new AMap.Marker({
        position: nursingHomePosition,
        icon: nursingHomeIcon,
        offset: new AMap.Pixel(-16, -32) // 偏移量
      })

      // 创建信息窗体
      const infoWindow = new AMap.InfoWindow({
        content:
          '<div><strong>悦年康居养老院</strong><br>四川省成都市成华大道二仙桥对面</div>', // 信息窗体的内容
        offset: new AMap.Pixel(0, -32) // 信息窗体的偏移量
      })

      // 当标记被点击时，打开信息窗体
      this.nursingHomeMarker.on('click', () => {
        infoWindow.open(this.map, nursingHomePosition)
      })

      // 添加养老院标记到地图
      this.map.add(this.nursingHomeMarker)
    },

    addRoute(AMap, startPosition) {
      const nursingHomePosition = [104.0658, 30.6631] // 养老院位置

      // 使用驾车路线规划服务
      const driving = new AMap.Driving({
        map: this.map,
        panel: 'route-panel', // 在指定元素中显示路线详情
        autoClamped: true
      })

      driving.search(startPosition, nursingHomePosition, (status, result) => {
        if (status === 'complete') {
          console.log('路线规划成功')
        } else {
          console.error('路线规划失败: ', result)
        }
      })
    }
  }
}
</script>

  <style>
.map-container {
  display: flex;
  flex-direction: column;
  height: 89.7vh; /* 使容器占满整个视口 */
}

#container {
  flex: 1; /* 让地图部分占用剩余空间 */
  font-family: "楷体";
}

.route-panel {
  max-height: 20vh; /* 设置路线信息面板的最大高度 */
  flex-shrink: 0; /* 防止面板收缩 */
  overflow-y: scroll;
  background-color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 10;
}
</style>
