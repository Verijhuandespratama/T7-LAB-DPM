// src/screens/Beranda/BerandaScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const mataKuliah = [
  { id: '1', nama: 'Dasar Pemrograman Mobile' },
  { id: '2', nama: 'Pengenalan Kecerdasan Buatan' },
  { id: '3', nama: 'Keamanan Siber' },
  { id: '4', nama: 'Pengolahan Citra Digital' },
  { id: '5', nama: 'Manajemen Proyek' },
];

export default function BerandaScreen() {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardText}>{item.nama}</Text>
      <Icon name="arrow-forward" size={20} color="#4CAF50" />
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{
        uri: 'https://pbs.twimg.com/media/DTaBQskVQAEaDac.jpg:large', 
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Mata Kuliah Semester 5</Text>
        <FlatList
          data={mataKuliah}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Overlay gelap untuk kontras
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
});
