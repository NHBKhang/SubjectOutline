import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ExpoPicker from 'expo-image-picker';

export const emailValidator = (email: string) => {
    const re = /\S+@\S+\.\S+/;

    if (!email || email.length <= 0) return 'Email không thể bỏ trống.';
    if (!re.test(email)) return 'Ooops! Chúng tôi cần email hợp lệ.';

    return '';
};

export const passwordValidator = (password: string) => {
    if (!password || password.length <= 0) return 'Mật khẩu không thể bỏ trống.';

    return '';
};

export const confirmPasswordValidator = (password: string, confirm: string) => {
    const err = passwordValidator(confirm);

    if (isNullOrEmpty(err) && password != confirm) {
        return 'Mật khẩu không trùng khớp.';
    }

    return err;
}

export const usernameValidator = (username: string) => {
    if (!username || username.length <= 0) return 'Tên tài khoản không thể bỏ trống.';

    return '';
};

export const stringValidator = (string: string, label: string) => {
    if (!string || string.trim().length <= 0) return `${label} không thể bỏ trống.`;

    return '';
}

export const numberValidator = (number: number | string, label: string, greaterThanZero: boolean) => {
    const numberString = typeof number === 'number' ? String(number) : number;

    if (!numberString || numberString.trim().length === 0) {
        return `${label} không thể bỏ trống.`;
    }

    if (isNaN(Number(numberString))) {
        return `${label} phải là một số.`;
    }

    if (greaterThanZero)
        return Number(numberString) > 0 ? '' : `${label} không thể bỏ trống.`;

    return '';
};

export const avatarValidator = (avatar: string) => {
    if (!avatar || avatar.length <= 0) return 'Ảnh đại diện không thể bỏ trống.';

    return '';
};

export const picker = async () => {
    let { status } = await ExpoPicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
        alert("Permission Denied!");
    }
    else {
        let res = await ExpoPicker.launchImageLibraryAsync();
        if (!res.canceled) {
            return res.assets[0];
        }
    }
}

export const parseStringToDate = (string) => {
    if (string) {
        try {
            const [day, month, year] = string.split('/');
            if (!day || !month || !year || year.length < 4)
                throw new Error('undefined');
            const dateObject = new Date(Number(year), Number(month - 1), Number(day));

            return dateObject;
        }
        catch (ex) {
            return null;
        }
    }
};

export function formatDateFromString(date) {
    if (date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;

        const formattedDateString = `${formattedDay}/${formattedMonth}/${year}`;

        return formattedDateString;
    }
}

export function toMyDate(inputDate) {
    if (inputDate) {
        const parts = inputDate.split('-');
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        return `${day}/${month}/${year}`;
    }
}

export function toServerDate(inputDate) {
    if (inputDate) {
        const parts = inputDate.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        return `${year}-${month}-${day}`;
    }
};

export const getAccessToken = async () => {
    const accessToken = await AsyncStorage.getItem("access-token");
    const tokenExpireTime = await AsyncStorage.getItem("token-expired");
    if (Number(tokenExpireTime) > Date.now())
        return accessToken;
    else
        return null;
};

export const processString = (inputString) => {
    if (inputString) {
        let processedString = '';
        for (let i = 0; i < inputString.length; i++) {
            if (inputString[i] === '\n') {
                processedString += '\n\t\t';
            } else {
                processedString += inputString[i];
            }
        }
        return processedString;
    }
};

export const firstRowSplit = (inputString) => {
    let processedString = '';
    if (inputString) {
        for (let i = 0; i < inputString.length; i++) {
            if (inputString[i] === '\n') {
                break;
            } else {
                processedString += inputString[i];
            }
        }
    }
    return processedString;
};

export const timeDifference = (date1, date2) => {
    const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
    const diffInMinutes = diffInMilliseconds / (1000 * 60);
    return diffInMinutes;
};

export const isNullOrEmpty = (str) => {
    return str == null || str.toString().trim() === '';
};

export const outlineTranslator = (label) => {
    if (label === 'title')
        return 'Tên đề cương';
    else if (label === 'years')
        return 'Niên khóa';
    else if (label === 'course')
        return '';
    else if (label === 'rule')
        return 'Quy định';

    return '';
}

export const checkPassword = async (password) => {
    try {
        const storedPassword = await AsyncStorage.getItem("password");
        if (storedPassword) {
            return storedPassword == password;
        }
        else
            return false;
    } catch (ex) {
        return false;
    }
}

export function getCurrentDate() {
    const date = new Date(Date.now());
    return date.toISOString().split('T')[0];
}

export const dropdownValue = (value: any) => {
    let arr = String(value).split(',');

    return arr.map(Number).filter(num => num > 0);
}