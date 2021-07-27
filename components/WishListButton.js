import {Text} from 'react-native-paper';
import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function WishListButton() {
    return(
        <View>
            <Icon name="heart-outline" color="#11CB46" size={28}/>
        </View>
    )
}