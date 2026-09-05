import { StyleSheet, View, Pressable } from 'react-native'
import { useCallback, useEffect, useState } from 'react'
import { IngredientNameUnit } from '../../model/model'
import { COLORS } from '../../constants/Colors'
import { GetIngredientNameUnitCategory } from '../../service/IngredientService'
import { ModalBackdrop } from '../Common/ModalBackdrop'
import { SearchInput } from '../Common/SearchInput'
import { SelectableListItem } from '../Common/SelectableListItem'
import { SubtitleText } from '../Common/SubtitleText'
import { TranslationKeys } from '../../locales/_translationKeys'
import { useTranslation } from 'react-i18next'
import { FlashList } from '@shopify/flash-list'

interface SelectIngredientOrUnitListProps {
    modalDataType: string
    visible: boolean
    onAdd: (item: { name: string }) => void
    onClose: () => void
}

export const SelectIngredientOrUnitList = ({ modalDataType, visible, onAdd, onClose }: SelectIngredientOrUnitListProps) => {
    const {t} = useTranslation()
    const [search, setSearch] = useState('')
    const [data, setData] = useState<IngredientNameUnit[]>([])
    const [dataFilter, setDataFilter] = useState<IngredientNameUnit[]>([])
    const [addButtonVisible, setAddButtonVisible] = useState(false)

    const GetIngredientsList = useCallback(() => {
        const ingredients = GetIngredientNameUnitCategory('ingredient')
        setData(ingredients)
        setDataFilter(ingredients)
    }, [])

    const GetUnitsList = useCallback(() => {
        const units = GetIngredientNameUnitCategory('unit')
        setData(units)
        setDataFilter(units)
    }, [])

    const fetchData = useCallback(() => {
        if(modalDataType === 'ingredient'){
            GetIngredientsList()
        }else if(modalDataType === 'unit'){
            GetUnitsList()
        }
    }, [modalDataType, GetIngredientsList, GetUnitsList])

    useEffect(() => {
        if(visible)
            fetchData()
    }, [visible, fetchData])

    const handlePress = (ingredient: { name: string }) => {
        onAdd(ingredient)
        handleOnClose()
    }
    const handleOnClose = () => {
        setSearch('')
        setData([])
        setDataFilter([])
        setAddButtonVisible(false)
        onClose()
    }

    const filterData = (search: string) => {
        const filteredData = search === '' ? data : data.map(item => {
            const filteredInnerData = item.data.filter(itemData => {
                if(modalDataType === 'ingredient'){
                    return t(TranslationKeys.IngredientItem[itemData.name as keyof typeof TranslationKeys.IngredientItem]).toLowerCase().includes(search.toLowerCase())
                }else if(modalDataType === 'unit'){
                    return t(TranslationKeys.UnitItem[itemData.name as keyof typeof TranslationKeys.UnitItem]).toLowerCase().includes(search.toLowerCase())
                }
            })
            if (filteredInnerData.length > 0) {
                return {
                    ...item,
                    data: filteredInnerData
                }
            }
            return null
        }).filter(item => item !== null)
        setDataFilter(filteredData)
        setAddButtonVisible(filteredData.length === 0 && search !== '')
    }

    return (
            <ModalBackdrop visible={visible} onClose={handleOnClose} cardStyle={styles.card}>
                <SearchInput
                    value={search}
                    onChangeText={text => {
                        setSearch(text)
                        filterData(text)
                    }}
                />
                { addButtonVisible && <SelectableListItem label={t(TranslationKeys.Button.ADD)} onPress={() => handlePress({ name: search})} />}
                <FlashList
                    data={dataFilter}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    style={styles.flex}
                    keyExtractor={item => item.type}
                    renderItem={({ item }) =>
                        <View style={styles.itemContainer}>
                            <Pressable>
                                { modalDataType === 'ingredient' && <SubtitleText style={styles.itemSubtitleText}>{t(TranslationKeys.IngredientType[item.type as keyof typeof TranslationKeys.IngredientType]) || item.type}</SubtitleText> }
                                { modalDataType === 'unit' && <SubtitleText style={styles.itemSubtitleText}>{t(TranslationKeys.UnitType[item.type as keyof typeof TranslationKeys.UnitType]) || item.type}</SubtitleText> }
                            </Pressable>
                            { item.data?.map((itemData, index) => (
                                <SelectableListItem
                                    key={itemData.name}
                                    label={modalDataType === 'ingredient'
                                        ? (t(TranslationKeys.IngredientItem[itemData.name as keyof typeof TranslationKeys.IngredientItem]) || itemData.name)
                                        : (t(TranslationKeys.UnitItem[itemData.name as keyof typeof TranslationKeys.UnitItem]) || itemData.name)}
                                    onPress={ () => handlePress(itemData) }
                                />
                            ))}
                        </View>
                    }
                />
            </ModalBackdrop>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        alignItems: 'center',
    },
    flex: {
        flex: 1,
        width: '100%',
    },
    itemSubtitleText: {
        textAlign: 'center',
    },
    card: {
        height: '80%',
        backgroundColor: COLORS.light,
    },
})
