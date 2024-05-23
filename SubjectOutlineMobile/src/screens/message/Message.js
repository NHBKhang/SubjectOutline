import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { memo, useContext, useEffect, useState } from 'react';
import { gStyles } from '../../core/global';
import SearchBar from '../../components/SearchBar';
import { authApi, endpoints } from '../../configs/API';
import Avatar from '../../components/Avatar';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllMessages } from '../../configs/Firebase';
import Context from '../../configs/Context';
import MessageCard from '../../components/cards/MessageCard';

const Message = ({ navigation }) => {
  const [user,] = useContext(Context);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(null);
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        let token = await AsyncStorage.getItem("access-token");
        let res = await authApi(token).get(`${endpoints.users}?q=${searchQuery}`);
        setUsers(res.data);
      } catch (ex) {
        setUsers([]);
        console.error(ex);
      }
    }

    loadUsers();
  }, [searchQuery]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setMessages(await getAllMessages(user));
      } catch (ex) {
        setMessages([]);
        console.error(ex);
      }
    }

    loadMessages();
  }, []);

  const chooseRoom = (userId) => {
    navigation.navigate("MessageRoom", { "userId": userId });
  };

  return (
    <View style={[gStyles.container, { position: 'relative' }]}>
      <SearchBar
        style={{ marginBottom: 20 }}
        placeholder='Tìm kiếm...'
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)} />

      {show && (<ScrollView style={[styles.searchContainer,
      users && users.length <= 1 && styles.default]}>
        {users ? users.map(u =>
          <TouchableHighlight key={u.id} onPress={() => chooseRoom(u.id)}>
            <View style={[gStyles.row, styles.userBox]}>
              <Avatar src={u.avatar} size={60} />
              <Text style={styles.username}>{u.name}</Text>
            </View>
          </TouchableHighlight>
        ) : (<View style={[gStyles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator />
        </View>)}
      </ScrollView>)}

      <ScrollView style={gStyles.scroll}>
        {messages ? <View>
          {messages.map((m, index) => <View key={index}>
            <MessageCard
              content={m.content}
              createdDate={m.created_date}
              onPress={() => chooseRoom(m.user.id)}
              user={m.user} /></View>
          )}
        </View> : <View style={[gStyles.container, { justifyContent: 'center' }]}>
          <ActivityIndicator />
        </View>}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  searchContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    width: '75%',
    height: 145,
    borderWidth: 0.75,
    borderColor: 'lightgray',
    top: 50,
    zIndex: 100
  },
  default: {
    height: 72.5
  },
  userBox: {
    borderWidth: 0.75,
    borderColor: 'lightgray',
    padding: 5,
    alignItems: 'center'
  },
  username: {
    fontSize: 16,
    marginStart: 10,
    fontWeight: '500'
  }
});

export default memo(Message);