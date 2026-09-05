import { StyleSheet, Pressable } from 'react-native'
import { useEffect, useState } from 'react'
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

interface SelectIngredientsListProps {
    alreadySelected: string[]
    visible: boolean
    onClose: (selectedIngredients: string[]) => void
}

export const SelectIngredientsList = ({ alreadySelected, visible, onClose }: SelectIngredientsListProps) => {
    const {t} = useTranslation()
    const [data, setData] = useState<IngredientNameUnit[]>()
    const [search, setSearch] = useState('')
    const [dataFilter, setDataFilter] = useState<IngredientNameUnit[]>([])

    const handlePress = (type: string, name: string) => {
        setData(prevIngredients => prevIngredients?.map(ing => ing.type === type ? { ...ing, data: ing.data.map(item => item.name === name ? { ...item, isSelected: !item.isSelected } : item )}: ing ))
        setDataFilter(prevIngredients => prevIngredients?.map(ing => ing.type === type ? { ...ing, data: ing.data.map(item => item.name === name ? { ...item, isSelected: !item.isSelected } : item )}: ing ))
    }

    const handleOnClose = () => {
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
            <ModalBackdrop visible={visible} onClose={handleOnClose} cardStyle={styles.card}>
                <SearchInput
                    value={search}
                    onChangeText={text => {
                        setSearch(text)
                        filterData(text)
                    }}
                />
                <FlashList
                    data={dataFilter}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="always"
                    style={styles.flex}
                    keyExtractor={item => item.type}
                    renderItem={({ item }) =>
                        <Pressable style={styles.itemContainer}>
                            <SubtitleText style={styles.itemSubtitleText}>{t(TranslationKeys.IngredientType[item.type as keyof typeof TranslationKeys.IngredientType]) || item.type}</SubtitleText>
                            { item.data?.map((itemData, index) => (
                                <SelectableListItem
                                    key={itemData.name}
                                    label={t(TranslationKeys.IngredientItem[itemData.name as keyof typeof TranslationKeys.IngredientItem]) || itemData.name}
                                    selected={itemData.isSelected}
                                    onPress={ () => handlePress(item.type, itemData.name) }
                                />
                            ))}
                        </Pressable>
                    }
                />
            </ModalBackdrop>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        alignItems: 'center',
    },
    itemSubtitleText: {
        textAlign: 'center',
    },
    flex: {
        flex: 1,
        width: '100%',
    },
    card: {
        height: '80%',
        backgroundColor: COLORS.light,
    },
})
