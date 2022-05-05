import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Buffer } from "buffer";

import { 
  StyleSheet,
  Text, 
  View, 
  Button, 
  PermissionsAndroid,
  Platform
 } from 'react-native';

import { BleManager } from 'react-native-ble-plx';

var manager = new BleManager()


function getServicesAndCharacteristics(device) {
  return new Promise((resolve, reject) => {
      device.services().then(services => {
          const characteristics = []
          services.forEach(async (service) => {
              console.log(`serv id = ${service.uuid}`)

                if(service.uuid === "0000ffff-0000-1000-8000-00805f9b34fb") {
                  console.log("hello!")
                  const characteristics = await device.characteristicsForService(service.uuid);
                  characteristics.forEach(async chr => {
                    console.log(chr)
                    console.log("number of chaacteristics")
                    console.log(`characteristics uuid = ${chr.uuid}`)
                    console.log(`characteristics service uuid = ${chr.serviceUUID}`)
                    console.log(`characteristics isReadable = ${chr.isReadable}`)
                    console.log(`characteristics is write = ${chr.isWritableWithResponse}`)

                    const test = await chr.read()
                    console.log(`tst v = ${test.value}`)
                    const tt = Buffer.from(test.value, 'base64')
                    // console.log(`tst2 = ${tt}`)
                    
                    console.log(tt)
                    console.log(tt.toString('hex'))


                    
                    
                    // const heartRateData = Buffer.from(chr.value, 'base64').readUInt16LE(0);
                    // console.log("Heart Beats:",heartRateData);

                  });
                }

              // service.characteristics().then(c => {
              //   // console.log("service.characteristics")
                
              //     characteristics.push(c)
              //     // console.log(characteristics)
              //     if (i === services.length - 1) {
              //         const temp = characteristics.reduce(
              //             (acc, current) => {
              //                 return [...acc, ...current]
              //             },
              //             []
              //         )
              //         const dialog = temp.find(
              //             characteristic =>
              //                 characteristic.isWritableWithoutResponse
              //         )
              //         if (!dialog) {
              //             // reject('No writable characteristic')
              //         }
              //         // resolve(dialog)
              //     }
                
              // })
          })
      })
  })
}



async function scanforDevices() {
  console.log("Scanning...")

  manager.startDeviceScan(null, null, (error, device) => {
    console.log("Scanning 2")

    if (error) {
      this.alert("Error in scan=> "+error)
      // this.setState({text1:""})
      manager.stopDeviceScan();
      return
  }
  //D4:6D:6D:01:9F:A9
    console.log(`device name = ${device.id}`)
    if(device.id.includes("D4:6")) {
      manager.stopDeviceScan()
      // manager.servicesForDevice(device.id).then((arr) => {
      //   console.log(arr)
      // })
      manager.connectToDevice(device.id).then((device) => {
        (async () => {
          console.log("I get to here lol")
          const deviceWithServices = await device.discoverAllServicesAndCharacteristics()
          const characteristic = await getServicesAndCharacteristics(deviceWithServices)
          // console.log("characteristic")
          // console.log(characteristic)
          // console.log("Discovering services and characteristics",characteristic.uuid);
          // this.setState({"deviceid":device.id, serviceUUID:serviceUUIDs, characteristicsUUID : characteristic.uuid,device:device })
          // this.setState({text1:"Conneted to "+device.name})
      })();
      })
    }
  })
  
}

async function connectToDev(id) {

}



export default function App() {


  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
          if (result) {
            console.log("Permission is OK");
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
              if (result) {
                console.log("User accept");
              } else {
                console.log("User refuse");
              }
            });
          }
      });
    }  
  })

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button
          onPress={scanforDevices}
          title="Scanr"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
      />


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
