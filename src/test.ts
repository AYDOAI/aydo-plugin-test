import {baseDriverModule} from '../core/base-driver-module';
import {inspect} from 'util';

class Test extends baseDriverModule {

  index = 0;
  currentStatus = {};

  initDeviceEx(resolve, reject) {
    super.initDeviceEx(() => {
      resolve({});
    }, reject);

  }

  connectEx(resolve, reject) {
    const status: any = {connected: true};
    this.capabilities = [];
    // this.capabilities.push({ident: 'power', index: 1, display_name: 'Power', homekit: true})
    // this.capabilities.push({ident: 'range', index: 2, display_name: 'Brightness', homekit: true})
    this.capabilities.push({ident: 'temperature', index: 1, display_name: 'Temperature'})
    this.capabilities.push({ident: 'humidity', index: 2, display_name: 'Humidity'})
    // this.capabilities.push({ident: 'co2', index: 3, display_name: 'CO2'})
    // this.capabilities.push({ident: 'power_load', index: 4, display_name: 'Power Load'})
    // this.capabilities.push({ident: 'voc', index: 5, display_name: 'VOC'})
    // this.capabilities.push({ident: 'p2', index: 6, display_name: 'PM2.5'})
    // this.capabilities.push({ident: 'sound_level', index: 7, display_name: 'Sound Level'})
    // this.capabilities.push({ident: 'power', index: 8, display_name: 'Power'})
    // this.capabilities.push({ident: 'voltage', index: 9, display_name: 'Voltage'})
    // this.capabilities.push({ident: 'counter', index: 10, display_name: 'Counter', water_usage_by_counter: true})
    this.counter = 0;
    status.capabilities = this.capabilities;
    this.publish(this.eventTypeStatus(this.pluginTemplate.class_name, `${this.id}`), status);

    this.getDevices().then(devices => {
      console.log(devices);
    });

    setInterval(() => {
      this.commandEx('status', null, null, null, () => {
      }, () => {
      }, null)
    }, 15000)
    resolve({});
  }

  commandEx(command, value, params, options, resolve, reject, status) {
    const between = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    }
    const update = () => {
      const status: any = {
        connected: true,
        // power_1: this.currentStatus[command] ? this.currentStatus[command] : false,
        // range_2: this.currentStatus[command] ? this.currentStatus[command] : 0,
        temperature_1: this.index > 10 ? 25.1 : between(20, 30),
        humidity_2: between(20, 40),
        // co2_3: between(400, 800),
        // power_load_4: between(10, 3000),
        // voc_5: between(10, 1000),
        // p2_6: between(0, 1000),
        // sound_level_7: between(20, 80),
        // power_8: true,
        // voltage_9: between(0, 300),
        // counter_10: this.counter,
      };
      this.publish(this.eventTypeStatus(this.pluginTemplate.class_name, `${this.id}`), status);
    }
    switch (command) {
      case 'status':
        this.index++;
        this.counter++;
        update()
        resolve({});
        break;
      default:
        this.currentStatus[command] = value;
        update()
        resolve({});
    }
  }

  getSubDevicesEx(resolve, reject, zones) {
    resolve([]);
  }

}

process.on('uncaughtException', (err) => {
  console.error(`${err ? err.message : inspect(err)}`);
});

const app = new Test();
app.logging = true;
