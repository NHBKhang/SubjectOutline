import { Alert, View } from "react-native";
import { gStyles } from "../../core/global";
import { memo, useEffect, useState } from "react";
import { ActivityIndicator, H1 } from "../../components";

const OutcomeDetails = ({ route, navigation }) => {
    const { outlineId, existed } = route.params;
    const [outcomes, setOutcomes] = useState(null);

    useEffect(() => {
        const loadOutcomes = async () => {
            try {
                let res = null;
                if (existed) {
                    res = await st;
                } else {
                    res = await st;
                }
                setOutcomes(res.data);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được mục tiêu môn học");
                navigation.goBack();
            }
        }

        loadOutcomes()
    }, [outlineId, existed]);

    return (
        <View style={gStyles.container}>
            <H1>Chuẩn đầu ra môn học</H1>
            {outcomes ? <ActivityIndicator /> : <View></View>}
        </View>
    )
}

export default memo(OutcomeDetails);