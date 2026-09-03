import { memo } from "react";
import {
    KeyboardAwareScrollView,
    KeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";
import {
    SCROLLABLE_TYPE,
    createBottomSheetScrollableComponent,
    type BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import type { BottomSheetScrollViewProps } from "@gorhom/bottom-sheet/src/components/bottomSheetScrollable/types";
import Reanimated from "react-native-reanimated";

const AnimatedScrollView =
    Reanimated.createAnimatedComponent<KeyboardAwareScrollViewProps>(
        KeyboardAwareScrollView as any,
    );
const BottomSheetScrollViewComponent = createBottomSheetScrollableComponent<
    BottomSheetScrollViewMethods,
    BottomSheetScrollViewProps
>(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView);
const BottomSheetKeyboardAwareScrollViewMemo = memo(BottomSheetScrollViewComponent);

BottomSheetKeyboardAwareScrollViewMemo.displayName =
    "BottomSheetKeyboardAwareScrollView";

export const BottomSheetKeyboardAwareScrollView = BottomSheetKeyboardAwareScrollViewMemo as (
    props: BottomSheetScrollViewProps & KeyboardAwareScrollViewProps,
) => ReturnType<typeof BottomSheetKeyboardAwareScrollViewMemo>;