import React, { memo } from 'react';
import { ScrollView, View } from 'react-native';
import { gStyles } from '../../core/global';
import { PaperLogo, Button, Paragraph, H1 } from '../../components';

const Dashboard = ({ navigation }) => (
    <ScrollView>
        <View style={[gStyles.container, gStyles.mx]}>
            <PaperLogo />
            <H1>Let’s start</H1>
            <Paragraph>
                Chào mừng bạn đến với ứng dụng đề cương môn học. Để bắt đầu đến với ứng dụng, hãy thêm những thông tin cần thiết.
            </Paragraph>
            <Button mode="outlined" onPress={() => navigation.navigate('AdditionalInfo')}>
                Tiếp tục
            </Button>
        </View>
    </ScrollView>
)

export default memo(Dashboard);