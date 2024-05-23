import { ScrollView, StyleSheet, View } from "react-native"
import { gStyles } from "../../core/global"
import { memo, useContext, useEffect, useState } from "react"
import SearchBar from "../../components/SearchBar"
import Context from "../../configs/Context"
import API, { endpoints } from "../../configs/API"
import { H1 } from "../../components/Header"
import OutlineCard from "../../components/cards/OutlineCard"
import { ActivityIndicator } from "react-native-paper"
import { TouchableOpacity } from "react-native-gesture-handler"

const MyWork = ({ navigation }) => {
    const [user,] = useContext(Context);
    const [outlines, setOutlines] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const loadOutlines = async () => {
            try {
                let res = await API.get(
                    `${endpoints["subject-outlines"]}?instructor_id=${user.id}&&q=${searchQuery}`);
                setOutlines(res.data.results);
            } catch (ex) {
                console.error(ex);
                setOutlines([]);
            }
        }

        loadOutlines();
    }, [searchQuery]);

    const goToMyWorkDetails = (outlineId) => {
        navigation.navigate("MyWorkDetails", {"outlineId": outlineId});
    }

    return (
        <View style={gStyles.container}>
            <SearchBar
                placeholder="Tìm..."
                value={searchQuery}
                onChangeText={t => setSearchQuery(t)} />
            <H1 style={styles.header}>ĐỀ CƯƠNG CỦA BẠN</H1>
            <ScrollView style={gStyles.scroll}>
                {outlines ? <>
                    {outlines.map(o =>
                        <TouchableOpacity key={o.id} onPress={() => goToMyWorkDetails(o.id)}>
                            <OutlineCard
                                title={o.title}
                                source={o.course.image}
                                code={o.year}
                                instructor={o.instructor.name} />
                        </TouchableOpacity>)}
                </> : <View style={[gStyles.container, { justifyContent: 'center' }]}>
                    <ActivityIndicator />
                </View>}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        color: '#000099',
        margin: -5,
        padding: 0,
        fontSize: 25
    }
});

export default memo(MyWork);