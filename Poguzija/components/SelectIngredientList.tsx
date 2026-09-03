import { Text, StyleSheet, Modal, Pressable, TextInput } from 'react-native'
import { useEffect, useState } from 'react'
import { IngredientNameUnit } from '../model/model'
import { COLORS, SIZES } from '../constants/Colors'
import { GetIngredientNameUnitCategory } from '../service/IngredientService'
import { MaterialIcons } from '@expo/vector-icons'
import { TranslationKeys } from '../locales/_translationKeys'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'

interface SelectIngredientListProps {
    alreadySelected: string[]
    visible: boolean
    onClose: (selectedIngredients: string[]) => void
}

export const SelectIngredientList = ({ alreadySelected, visible, onClose }: SelectIngredientListProps) => {
    const {t} = useTranslation()
    const [data, setData] = useState<IngredientNameUnit[]>()
    const [search, setSearch] = useState('')
    const [dataFilter, setDataFilter] = useState<IngredientNameUnit[]>([])

    const handlePress = (type: string, name: string) => {
        setData(prevIngredients => prevIngredients?.map(ing => ing.type === type ? { ...ing, data: ing.data.map(item => item.name === name ? { ...item, isSelected: !item.isSelected } : item )}: ing ))
        setDataFilter(prevIngredients => prevIngredients?.map(ing => ing.type === type ? { ...ing, data: ing.data.map(item => item.name === name ? { ...item, isSelected: !item.isSelected } : item )}: ing ))
    }

    const handleClose = () => {
        const ingredientyData = data
        const searchFields = ingredientyData?.map(i => i.data.filter(j => j.isSelected).map(j => j.name)).flat()
        onClose(searchFields ?? [])
        setSearch('')
        setDataFilter([])
    }

    const filterData = (search: string) => {
        const safeData = data ?? []
        const filteredData = search === '' ? safeData : safeData.map(item => {
            const filteredInnerData = item.data.filter(dataItem => 
                t(TranslationKeys.IngredientItem[dataItem.name as keyof typeof TranslationKeys.IngredientItem]).toLowerCase().includes(search.toLowerCase())
            )
            if (filteredInnerData.length > 0) {
                return {
                    ...item,
                    data: filteredInnerData
                }
            }
            return null
        }).filter(item => item !== null)
        setDataFilter(filteredData)
    }

    const fetchData = () => {
        const ingredients = GetIngredientNameUnitCategory('ingredient')
        setData(ingredients)
        setDataFilter(ingredients)
    }

    useEffect(() => {
        setData(prevData => {
            if(!alreadySelected || !prevData){
                fetchData()
                return prevData
            }
            const alreadySelectedData = prevData.map(sel => ({...sel,
                data: sel.data.map(item => ({...item,
                isSelected: alreadySelected.includes(item.name),
            }))}))
            setDataFilter(alreadySelectedData)
            return alreadySelectedData
        })
    },[alreadySelected])

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={ () => handleClose() }>
            <Pressable style={styles.centeredView} onPress={ () => handleClose() }>
                <Pressable style={styles.modalView}>
                    <Pressable style={styles.inputContainer}>
                        <MaterialIcons name="search" style={styles.icon} />
                        <TextInput
                            style={styles.textInput}
                            placeholder={t(TranslationKeys.Button.SEARCH)}
                            value={search}
                            autoComplete='off'
                            onChangeText={text => {
                                setSearch(text)
                                filterData(text)
                            }}
                        />
                    </Pressable>
                    <FlashList
                        data={dataFilter}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        style={styles.flex}
                        keyExtractor={item => item.type}
                        renderItem={({ item }) => 
                            <Pressable>
                                <Pressable><Text style={styles.subtitleText}>{t(TranslationKeys.IngredientType[item.type as keyof typeof TranslationKeys.IngredientType]) || item.type}</Text></Pressable>
                                { item.data?.map((itemData, index) => (
                                    <Pressable
                                        style={ itemData.isSelected ? styles.buttonModalSelected : styles.buttonModal }
                                        onPress={ () => handlePress(item.type, itemData.name) }
                                        key={itemData.name}>
                                        <Text style={styles.textStyle}>{t(TranslationKeys.IngredientItem[itemData.name as keyof typeof TranslationKeys.IngredientItem]) || itemData.name}</Text>
                                    </Pressable>
                                ))}
                            </Pressable>
                        }
                    />
                </Pressable>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        width: '100%',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        height: '80%',
        width: '80%',
        backgroundColor: COLORS.light,
        borderRadius: SIZES.extraLarge,
        padding: SIZES.small,
        alignItems: 'center',
        shadowColor: COLORS.dark,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonModal: {
        borderRadius: 20,
        padding: 10,
        marginVertical: 0.2 * SIZES.base,
        width: '100%',
        elevation: 2,
        backgroundColor: COLORS.tint,
    },
    buttonModalSelected: {
        borderRadius: 20,
        padding: 10,
        marginVertical: 0.2 * SIZES.base,
        width: '100%',
        elevation: 2,
        backgroundColor: COLORS.dark,
    },
    textStyle: {
        width: '100%',
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '95%',
        height: 60,
        backgroundColor: COLORS.white,
        borderRadius: SIZES.extraLarge,
        marginBottom: SIZES.small,
        paddingHorizontal: SIZES.small,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    textInput: {
        width: '100%',
        marginRight: 10,
        color: COLORS.tint,
        fontSize: SIZES.large,
    },
    icon: {
        marginRight: 10,
        color: COLORS.lightDark,
        fontSize: SIZES.extraLarge,
    },
    subtitleText: {
        width: '85%',
        color: COLORS.tint,
        fontSize: SIZES.extraLarge,
        fontWeight: 'bold',
        marginBottom: 0.5 * SIZES.base,
        marginTop: SIZES.small,
    },
})
