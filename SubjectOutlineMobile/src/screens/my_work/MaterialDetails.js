import { Alert, View } from "react-native";
import { gStyles } from "../../core/global";
import { memo, useEffect, useState } from "react";
import { ActivityIndicator, H1 } from "../../components";

const OutcomeDetails = ({ route, navigation }) => {
    const { outlineId, existed } = route.params;
    const [materials, setMaterials] = useState(null);

    useEffect(() => {
        const loadMaterials = async () => {
            try {
                let res = null;
                if (existed) {
                    res = await st;
                } else {
                    res = await st;
                }
                setMaterials(res.data);
            } catch (ex) {
                console.error(ex);
                Alert.alert("Error", "Không thể tải được mục tiêu môn học");
                navigation.goBack();
            }
        }

        loadMaterials()
    }, [outlineId, existed]);

    return (
        <View style={gStyles.container}>
            <H1>Chuẩn đầu ra môn học</H1>
            {outcomes ? <ActivityIndicator /> : <View></View>}
        </View>
    )
}

export default memo(OutcomeDetails);