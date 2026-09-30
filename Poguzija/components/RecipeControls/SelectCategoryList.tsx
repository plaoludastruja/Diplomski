import { StyleSheet, Pressable } from 'react-native'
import { useEffect, useState } from 'react'
import { Category } from '../../model/model'
import { COLORS } from '../../constants/Colors'
import { TranslationKeys } from '../../locales/_translationKeys'
import { useTranslation } from 'react-i18next'
import { GetIngredientNameUnitCategory } from '../../service/IngredientService'
import { ModalBackdrop } from '../Common/ModalBackdrop'
import { SelectableListItem } from '../Common/SelectableListItem'
import { SubtitleText } from '../Common/SubtitleText'
import { FlashList } from '@shopify/flash-list'

interface SelectCategoryListProps {
    alreadySelected: string[]
    visible: boolean
    onClose: (selectedCategories: string[]) => void
}

export const SelectCategoryList = ({ alreadySelected, visible, onClose }: SelectCategoryListProps) => {
    const {t} = useTranslation()
    const [category, setCategory] = useState<Category[]>()
    const handlePress = (type: string, name: string) => {
        setCategory(prevCategories => prevCategories?.map(cat => cat.type === type ? { ...cat, data: cat.data.map(item => item.name === name ? { ...item, isSelected: !item.isSelected } : item )}: cat ))
    }

    const handleOnClose = () => {
        const categoryData = category
        const searchFields = categoryData?.map(i => i.data.filter(j => j.isSelected).map(j => j.name)).flat()
        onClose(searchFields ?? [])
    }

    useEffect(() => {
        setCategory(prevCategory => {
            if(alreadySelected && prevCategory){
                return prevCategory.map(cat => ({...cat,
                    data: cat.data.map(item => ({...item,
                        isSelected: alreadySelected.includes(item.name),
                    }))}))
            }
            return GetIngredientNameUnitCategory('category')
        })
    },[alreadySelected])

    return (
            <ModalBackdrop visible={visible} onClose={handleOnClose} cardStyle={styles.card}>
                <FlashList
                    data={category}
                    showsVerticalScrollIndicator={false}
                    style={styles.flex}
                    renderItem={({ item }) =>
                        <Pressable style={styles.itemContainer}>
                            <SubtitleText style={styles.itemSubtitleText}>{t(TranslationKeys.CategoryType[item.type as keyof typeof TranslationKeys.CategoryType]) || item.type}</SubtitleText>
                            { item.data?.map((categoryData, index) => (
                                <SelectableListItem
                                    key={categoryData.name}
                                    label={t(TranslationKeys.CategoryItem[categoryData.name as keyof typeof TranslationKeys.CategoryItem]) || categoryData.name}
                                    selected={categoryData.isSelected}
                                    onPress={ () => handlePress(item.type, categoryData.name) }
                                />
                            ))}
                        </Pressable>
                    }
                    keyExtractor={item => item.type}
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
