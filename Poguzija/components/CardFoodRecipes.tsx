import { View, Image } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components/native';
import { COLORS, SIZES } from '../constants/Colors';
import { FoodRecipes } from '../model/model';
import { useRouter } from 'expo-router';
const PlaceholderImage = require('../assets/images/icon.png');

const CardFoodRecipes: FC<{ data: FoodRecipes }> = ({ data }): JSX.Element => {
    const router = useRouter();
    const handlePress = (data: FoodRecipes) => {
        console.log('View pressed on ID: ', data.id);
        router.push(`/foodRecipesItem/${data.id}`);
    };

    const handleLongPress = (data: FoodRecipes) => {
        console.log('View held down on ID: ', data.id);
    };

    return (
        <Card>
            <View1 onPress={() => handlePress(data)} onLongPress={() => handleLongPress(data)} >
                <Image
                    source={ data.images ? { uri: data.images[0] } : PlaceholderImage }
                    resizeMode="cover"
                    style={{
                        width: "100%",
                        height: "50%",
                        borderRadius: SIZES.large

                    }} />
                <Text>{data.title}</Text>
                <Text>{data.author}</Text>
            </View1>
        </Card>
    )
}

export default CardFoodRecipes

const Card = styled.View`
    background-color: ${COLORS.lightDark} ;
    margin: ${SIZES.base}px;
    border-radius: ${SIZES.large}px;
`;

const View1 = styled.Pressable`
    width: 100%;
    height: 450px;
    overflow: hidden;

`;

const Text = styled.Text`
    font-size: 18px;
    color: ${COLORS.light};
    font-weight: 500;
    padding-right: ${SIZES.base}px;
    padding-left: ${SIZES.base}px;
`;