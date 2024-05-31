import { View, ScrollView, StyleSheet } from 'react-native';
import { gStyles } from '../../core/global';
import SearchBar from '../../components/SearchBar';
import { memo, useEffect, useState } from 'react';
import { H1 } from '../../components/Header';
import API, { endpoints } from '../../configs/API';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
import OutlineCard from '../../components/cards/OutlineCard';

const Outline = ({ route, navigation }) => {
  const courseId = route.params?.courseId;

  const [searchQuery, setSearchQuery] = useState('');
  const [outlines, setOutlines] = useState(null);

  useEffect(() => {
    const loadOutlines = async () => {
      try {
        let res = await API.get(
          `${endpoints['subject-outlines']}?course_id=${courseId}&&q=${searchQuery}`);
        setOutlines(res.data.results);
      } catch (ex) {
        setOutlines([]);
        console.error(ex);
      }
    };

    loadOutlines();
  }, [courseId, searchQuery]);

  const goToOutlineDetails = (outlineId) => {
    navigation.navigate("OutlineDetails", { "outlineId": outlineId });
  };

  return (
    <View style={gStyles.container}>
      <SearchBar
        placeholder="Tìm kiếm..."
        onChangeText={setSearchQuery}
        value={searchQuery} />

      <H1>ĐỀ CƯƠNG MÔN HỌC</H1>
      <ScrollView style={gStyles.scroll}>
        {outlines === null ? <ActivityIndicator /> : <>
          {
            outlines.map(o => (
              <View style={gStyles.row} key={o.id}>
                <TouchableOpacity onPress={() => goToOutlineDetails(o.id)}>
                  <OutlineCard
                    title={o.title}
                    source={o.course.image}
                    years={o.years}
                    instructor={o.instructor.name} />
                </TouchableOpacity>
              </View>
            ))
          }
        </>}
      </ScrollView>
    </View>
  )
}
export default memo(Outline);