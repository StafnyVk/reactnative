import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Pressable,
  Text,
  Modal,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [list, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [uniqueId, setUniqueId] = useState("");

  const url = `https://randomuser.me/api/?page=${currentPage}&results=10`;

  /**
   * Function to fetch Users
   */
  const fetchUsers = () => {
    setLoading(true);
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setData([...list, ...response.results]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  /**
   * Function to update page Number as we scroll
   */
  const loadItems = () => {
    setCurrentPage(currentPage + 1);
  };

  /**
   * Function to display each card
   * @param {object} item each user details to display 
   * @returns {Node} card with user details
   */
  const renderCard = ({ item }) => {
    return (
      <View
        style={styles.card}
        onStartShouldSetResponder={() => {
          setModalVisible(true);
          setUniqueId(item.login.uuid);
        }}
      >
        <View>
          <Text
            style={{ fontSize: 24, fontWeight: "bold" }}
          >{`${item.name.title} ${item.name.first} ${item.name.last}`}</Text>
          <Text style={{ fontSize: 14, fontStyle: "italic" }}>
            {item.email}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {item.location.state} {item.location.country}
          </Text>
        </View>
        <View>
          <Image
            style={styles.imageStyles}
            source={{ uri: item.picture.large }}
          />
        </View>
      </View>
    );
  };
  
  /**
   * Function to indicate the list is loading
   * @returns {node} a text that says "Loading"
   */
  const loader = () => {
    return loading ? <Text style={{ fontSize: 29 }}>Loading ...</Text> : null;
  };

  return (
    <View>
      <View style={{ marginTop:30}}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackGround}>
      
          <View style={styles.modalView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Image
                source={require("./assets/cross-icon.png")}
                style={{ height: 25, width: 25 }}
              />
            </TouchableOpacity>
          </View>
            {list
              .filter((user) => user.login.uuid.includes(uniqueId))
              .map((filteredUser) => (
                <View>
                  <Image
                    style={{ width: 150, height: 150 }}
                    source={{ uri: filteredUser.picture.large }}
                  />
                  <Text style={{ fontSize: 20 ,fontWeight:'bold'}}>
                    {filteredUser.name.first}{' '}
                    {filteredUser.name.last}
                  </Text>
                  <Text style={{fontSize:15}}>{`Location: ${filteredUser.location.city},${filteredUser.location.state} ${filteredUser.location.country}`}</Text>
                </View>
              ))}
            </View>
          </View>
        </Modal>
      </View>
      <FlatList
        style={modalVisible ? styles.blurView : ""}
        data={list}
        renderItem={renderCard}
        keyExtractor={(item) => item.email}
        ListFooterComponent={loader}
        onEndReached={loadItems}
        onEndReachedThreshold={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blurView: {
    opacity: 0.1,
  },
  card: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
    marginRight:10,
    marginBottom:20,
  },
  imageStyles: {
    width: 60,
    height: 50,
    marginRight: 16,
    borderRadius: 15,
  },
  modalText: {
    fontSize: 30,
  },
  header: {
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  modalView: {
    width: '75%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
   height:300,
   alignItems:"center",
   justifyContent:"center"

  },
  modalBackGround: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
