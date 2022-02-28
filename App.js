import React, { useState, useEffect  } from 'react';
import { StyleSheet, StatusBar, View, Button, TextInput, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  // Location example
  const [hakuSana, setHakuSana] = useState('Kamppi, helsinki');
  const [koordinaatit, setKoordinaatit] = useState({
    latitude: 60.168535,
    longitude: 24.930494,
    latitudeDelta: 0.006,
    longitudeDelta: 0.004
  });

  const [location, setLocation] = useState(null); // State where location is saved

  const haeOsoite = () => {
    fetch(`http://www.mapquestapi.com/geocoding/v1/address?key=KEY&location=${hakuSana}`) //api-key removed
    .then(response => response.json())
    .then(responseJson  =>  setKoordinaatit({
      latitude: responseJson.results[0].locations[0].latLng.lat,
      longitude: responseJson.results[0].locations[0].latLng.lng,
      latitudeDelta: 0.006,
      longitudeDelta: 0.004
    }))
    .catch(error => { 
        Alert.alert('Error', error.message); 
    });
    console.log("koordinaatit: ", koordinaatit);
  }  

  useEffect(() => (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to get location')
      return;
    }
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation(location);
    setKoordinaatit({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.006,
      longitudeDelta: 0.004
    })
    console.log('Location:', location)
  })(), []);


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={koordinaatit}
      >
        <Marker
          coordinate={koordinaatit}
          title='Haaga-Helia'
        />
      </MapView>
      <TextInput  
        onChangeText={text => setHakuSana(text)}
        placeholder='Search address' >
      </TextInput>
      <Button style={styles.nappi}  onPress={haeOsoite}
        title="Show"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  nappi: {
    borderRadius: 25,
    padding:10
  }
});