import React, {useContext, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Text, Image, View, ImageBackground, TouchableOpacity} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import {withTheme} from 'react-native-paper';
import tailwind from 'tailwind-rn';
import {AlertContext} from '../context/AlertContext';
import WishListButton from '../shared/WishListButton';

function HomeScreen(props) {
    const ref = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [heroMovie, setHeroMovie] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [moviesList, setMoviesList] = useState([]);
    const navigation = useNavigation();
    const {primary, title, flashyGreen} = props.theme.colors;
    const {dropDownAlert} = useContext(AlertContext);

    useEffect(() => {
    }, []);

    useEffect(async () => {
        await axios.get('https://api.themoviedb.org/3/movie/10699?api_key=318dc2bc4628a09c26291d2dbd0ca6b2')
            .then(res => {
                setIsLoading(false);
                setHeroMovie(res.data);
            })
            .catch(err => {
                dropDownAlert.alertWithType('error', 'Erreur', 'Une erreur est survenue lors de la récupération des films');
            });
        await axios.get('https://api.themoviedb.org/3/movie/popular?api_key=318dc2bc4628a09c26291d2dbd0ca6b2&language=fr&page=1')
            .then(res => {
                setIsLoading(false);
                let lastFiveMovies = res.data.results.slice(0, 5).map(movie => movie);
                setMoviesList(lastFiveMovies);
            })
            .catch(err => {
                dropDownAlert.alertWithType('error', 'Erreur', 'Une erreur est survenue lors de la récupération des films');
            });
    }, []);

    const onPressCarousel = (item) => {
        navigation.navigate('MovieDetails', {item});
    };

    const onPressHero = (item) => {
        navigation.navigate('MovieDetails', {item});
    };

    const renderItem = ({item}) => {
        return (
            <View style={[{
                height: 180,
                padding: 5,
            }, tailwind('bg-white mx-7 rounded-lg')]}>
                <TouchableWithoutFeedback onPress={() => onPressCarousel(item)}>
                    <View>
                        <Image source={{uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}`}}
                               style={[{resizeMode: 'contain', width: '100%', height: 135}]}/>
                    </View>
                </TouchableWithoutFeedback>

                <View style={tailwind('flex-row bg-white pt-2 max-h-8')}>
                    <Text style={[{
                        lineHeight: 1,
                        color: title,
                        fontWeight:'bold'
                    }, tailwind('flex-1 text-sm text-left self-start')]}>{item.original_title}
                    </Text>
                    <View style={tailwind('pr-3 items-end self-center')}>
                        <WishListButton movieItem={item} />
                    </View>
                </View>
            </View>
        );
    };

    return (
        <>
            <View style={tailwind('flex-1')}>
                {!isLoading ?
                    <>
                        <View style={{height: 3, backgroundColor: flashyGreen}}/>
                        <View style={tailwind('flex-1')}>
                            <TouchableOpacity onPress={() => onPressHero(heroMovie)}>
                                <Image
                                    source={{uri: `https://image.tmdb.org/t/p/w500${heroMovie.backdrop_path}`}}
                                    style={[tailwind('h-full w-full justify-end')]}/>
                                <Text style={[{
                                    color: primary,
                                    fontWeight: 'bold',
                                    backgroundColor: '#000000c0',
                                }, tailwind('w-full absolute bottom-0 flex-1 text-2xl leading-10 text-center')]}>{heroMovie.original_title}
                                </Text>
                                <View style={tailwind('flex-row')}>
                                    <View
                                        style={tailwind('flex-1 mb-1 bottom-0 right-0 absolute pr-5 items-end self-center')}>
                                        <WishListButton movieItem={heroMovie} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={tailwind('flex-1')}>
                            <Text style={[{
                                color: primary,
                                fontWeight: 'bold',
                            }, tailwind('px-5 pt-2 text-left text-xl')]}>Le top 5</Text>
                            <Text style={[{color: primary}, tailwind('px-5 pb-3 opacity-60')]}>Les
                                films les plus populaires</Text>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                <Carousel
                                    layout={'default'}
                                    ref={ref}
                                    data={moviesList}
                                    sliderWidth={300}
                                    itemWidth={300}
                                    renderItem={renderItem}
                                    onSnapToItem={(index) => setActiveSlide(index)}
                                />
                            </View>
                        </View>
                    </> :
                    <View style={tailwind('flex-1 justify-center')}>
                        <ActivityIndicator size="large" color={flashyGreen}/>
                    </View>}
            </View>
        </>
    );
}

export default withTheme(HomeScreen);
